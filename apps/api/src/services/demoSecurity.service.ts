import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/client';

const secret = () => process.env.DEMO_SECURITY_SECRET || 'page-ai-development-only-secret';
const digest = (value: string) => crypto.createHmac('sha256', secret()).update(value).digest('hex');
const encode = (value: string) => Buffer.from(value).toString('base64url');

export function hashValue(value: string) { return digest(value); }
export function getIpHash(req: Request) { return digest((req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'); }

export function visitorCookie(req: Request, res: Response, next: NextFunction) {
  const raw = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('pageai_visitor='))?.split('=')[1];
  let visitorId = '';
  if (raw) {
    const [id, signature] = raw.split('.');
    const expected = id ? digest(id) : '';
    if (id && signature && signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) visitorId = id;
  }
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    res.cookie('pageai_visitor', `${visitorId}.${digest(visitorId)}`, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  res.locals.visitorId = visitorId;
  next();
}

export function createEmailToken(email: string) {
  const payload = encode(JSON.stringify({ email: email.toLowerCase(), exp: Date.now() + 24 * 60 * 60 * 1000 }));
  return `${payload}.${digest(payload)}`;
}

export function verifyEmailToken(token?: string): string | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || digest(payload) !== signature) return null;
  try { const data = JSON.parse(Buffer.from(payload, 'base64url').toString()); return data.exp > Date.now() && typeof data.email === 'string' ? data.email : null; } catch { return null; }
}

export async function checkLimit(scopeKey: string, action: string, max: number, windowMs: number) {
  const current = await db.usageCounter.findUnique({ where: { scopeKey_action: { scopeKey, action } } });
  if (!current || Date.now() - current.windowStart.getTime() >= windowMs) return { allowed: true, remaining: max };
  return { allowed: current.count < max, remaining: Math.max(0, max - current.count) };
}

export async function incrementUsage(scopeKey: string, action: string, windowMs: number) {
  const current = await db.usageCounter.findUnique({ where: { scopeKey_action: { scopeKey, action } } });
  if (!current || Date.now() - current.windowStart.getTime() >= windowMs) {
    await db.usageCounter.upsert({ where: { scopeKey_action: { scopeKey, action } }, create: { scopeKey, action, count: 1, windowStart: new Date() }, update: { count: 1, windowStart: new Date() } });
  } else await db.usageCounter.update({ where: { id: current.id }, data: { count: { increment: 1 } } });
}

export async function sendVerificationEmail(email: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === 'production') throw new Error('Servicio de correo no configurado');
    return false;
  }
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || 'CraftPage <onboarding@resend.dev>', to: [email], subject: 'Tu código de verificación de CraftPage', html: `<div style="font-family:Arial;padding:24px"><h2>Verifica tu correo</h2><p>Tu código para generar la demo editable es:</p><p style="font-size:32px;font-weight:800;letter-spacing:8px">${code}</p><p>Caduca en 10 minutos.</p></div>` }) });
  if (!response.ok) throw new Error('No se pudo enviar el correo de verificación');
  return true;
}

export async function sendAdminLoginEmail(email: string, code: string) {
  if (!process.env.RESEND_API_KEY) throw new Error('Servicio de correo no configurado');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'CraftPage <onboarding@resend.dev>', to: [email],
      subject: 'Código de acceso administrativo de CraftPage',
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px"><p style="color:#6578ff;font-weight:700">PAGE AI</p><h2>Confirma tu acceso</h2><p>Utiliza este código para entrar al panel administrativo:</p><p style="font-size:34px;font-weight:800;letter-spacing:8px">${code}</p><p style="color:#666">Caduca en 10 minutos. Si no intentaste iniciar sesión, ignora este mensaje.</p></div>`,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error('[email] Resend admin login failed', response.status, detail.slice(0, 300));
    throw new Error('No se pudo enviar el código administrativo');
  }
}

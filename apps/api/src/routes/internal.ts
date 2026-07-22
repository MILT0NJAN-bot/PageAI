import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../middleware/projectAccess';
import { db } from '../db/client';
import { hashValue, sendAdminLoginEmail } from '../services/demoSecurity.service';

export const internalRouter = Router();
internalRouter.use(requireAdmin);

const rateSchema = z.object({
  email: z.string().email().max(254), ip: z.string().min(1).max(100),
  operation: z.enum(['check', 'failure', 'success', 'otp']),
});
const WINDOW_MS = 15 * 60 * 1000;

async function status(scopeKey: string, action: string, max: number) {
  const record = await db.usageCounter.findUnique({ where: { scopeKey_action: { scopeKey, action } } });
  if (!record || Date.now() - record.windowStart.getTime() >= WINDOW_MS) return { allowed: true, retryAfterSeconds: 0 };
  return { allowed: record.count < max, retryAfterSeconds: Math.max(1, Math.ceil((record.windowStart.getTime() + WINDOW_MS - Date.now()) / 1000)) };
}
async function increment(scopeKey: string, action: string) {
  const current = await db.usageCounter.findUnique({ where: { scopeKey_action: { scopeKey, action } } });
  if (!current || Date.now() - current.windowStart.getTime() >= WINDOW_MS) {
    await db.usageCounter.upsert({ where: { scopeKey_action: { scopeKey, action } }, create: { scopeKey, action, count: 1, windowStart: new Date() }, update: { count: 1, windowStart: new Date() } });
  } else await db.usageCounter.update({ where: { id: current.id }, data: { count: { increment: 1 } } });
}

internalRouter.post('/admin-auth/rate-limit', async (req, res) => {
  const parsed = rateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Solicitud inválida' });
  const { email, ip, operation } = parsed.data;
  const scopes = [`admin-email:${hashValue(email)}`, `admin-ip:${hashValue(ip)}`];
  if (operation === 'success') {
    await db.usageCounter.deleteMany({ where: { scopeKey: { in: scopes }, action: { in: ['admin_login', 'admin_otp'] } } });
    return res.json({ allowed: true });
  }
  const action = operation === 'otp' ? 'admin_otp' : 'admin_login';
  const max = operation === 'otp' ? 3 : 5;
  const states = await Promise.all(scopes.map(scope => status(scope, action, max)));
  if (states.some(state => !state.allowed)) return res.status(429).json({ allowed: false, retryAfterSeconds: Math.max(...states.map(state => state.retryAfterSeconds)) });
  if (operation === 'failure' || operation === 'otp') await Promise.all(scopes.map(scope => increment(scope, action)));
  return res.json({ allowed: true });
});

internalRouter.post('/admin-auth/send-code', async (req, res) => {
  const parsed = z.object({ email: z.string().email().max(254), code: z.string().regex(/^\d{6}$/) }).safeParse(req.body);
  if (!parsed.success || parsed.data.email.toLowerCase() !== (process.env.ADMIN_EMAIL || '').trim().toLowerCase()) return res.status(400).json({ error: 'Solicitud inválida' });
  await sendAdminLoginEmail(parsed.data.email, parsed.data.code);
  return res.json({ sent: true });
});

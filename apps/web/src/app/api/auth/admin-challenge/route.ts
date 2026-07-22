import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminRateLimit, createAdminChallenge, getRequestIp, verifyAdminPassword } from '@/lib/adminSecurity';

const genericError = () => NextResponse.json({ error: 'No se pudo validar el acceso' }, { status: 401 });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: unknown; password?: unknown };
    if (typeof body.email !== 'string' || typeof body.password !== 'string' || body.email.length > 254 || body.password.length > 200) return genericError();
    const ip = getRequestIp(req.headers);
    const rate = await adminRateLimit(body.email, ip, 'check');
    if (!rate.allowed) return NextResponse.json({ error: 'Demasiados intentos. Espera antes de volver a intentar.', retryAfterSeconds: rate.retryAfterSeconds }, { status: 429 });
    if (!await verifyAdminPassword(body.email, body.password)) {
      await adminRateLimit(body.email, ip, 'failure');
      return genericError();
    }
    const otpRate = await adminRateLimit(body.email, ip, 'otp');
    if (!otpRate.allowed) return NextResponse.json({ error: 'Ya solicitaste varios códigos. Espera antes de solicitar otro.', retryAfterSeconds: otpRate.retryAfterSeconds }, { status: 429 });
    const code = crypto.randomInt(100000, 1000000).toString();
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const sent = await fetch(`${apiUrl}/api/internal/admin-auth/send-code`, {
      method: 'POST', cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': process.env.ADMIN_API_KEY || '' },
      body: JSON.stringify({ email: body.email.trim().toLowerCase(), code }),
    });
    if (!sent.ok) throw new Error('No se pudo enviar el código administrativo');
    return NextResponse.json({ challenge: createAdminChallenge(body.email, code), expiresInSeconds: 600 }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[admin-auth] challenge failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'El acceso administrativo no está disponible temporalmente' }, { status: 503 });
  }
}

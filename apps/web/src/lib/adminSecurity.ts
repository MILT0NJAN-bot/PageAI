import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const secret = () => {
  const value = process.env.NEXTAUTH_SECRET;
  if (!value || value.length < 32) throw new Error('NEXTAUTH_SECRET debe tener al menos 32 caracteres');
  return value;
};
const hmac = (value: string) => crypto.createHmac('sha256', secret()).update(value).digest('base64url');
const safeEqual = (left: string, right: string) => {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

let dummyHashPromise: Promise<string> | undefined;
const dummyHash = () => dummyHashPromise ??= bcrypt.hash('page-ai-invalid-account', 12);

export async function verifyAdminPassword(email: string, password: string) {
  const configuredEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');
  const configuredHash = process.env.ADMIN_PASSWORD_HASH || await dummyHash();
  const emailMatches = normalizeEmail(email) === configuredEmail && configuredEmail.length > 0;
  const passwordMatches = await bcrypt.compare(password, configuredHash).catch(() => false);
  return emailMatches && passwordMatches;
}

export function createAdminChallenge(email: string, code: string) {
  const payload = Buffer.from(JSON.stringify({
    email: normalizeEmail(email),
    codeHash: hmac(`otp:${code}`),
    expiresAt: Date.now() + 10 * 60 * 1000,
    nonce: crypto.randomBytes(16).toString('base64url'),
  })).toString('base64url');
  return `${payload}.${hmac(`challenge:${payload}`)}`;
}

export function verifyAdminChallenge(token: string, email: string, code: string) {
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, hmac(`challenge:${payload}`))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: string; codeHash?: string; expiresAt?: number };
    return data.email === normalizeEmail(email)
      && typeof data.expiresAt === 'number' && data.expiresAt > Date.now()
      && typeof data.codeHash === 'string' && safeEqual(data.codeHash, hmac(`otp:${code}`));
  } catch { return false; }
}

export function getRequestIp(headers: Headers | Record<string, string | string[] | undefined>) {
  const read = (name: string) => headers instanceof Headers ? headers.get(name) : headers[name];
  const forwarded = read('x-forwarded-for');
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded || read('x-real-ip') || 'unknown').split(',')[0].trim().slice(0, 100);
}

type RateOperation = 'check' | 'failure' | 'success' | 'otp';
export async function adminRateLimit(email: string, ip: string, operation: RateOperation) {
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) throw new Error('ADMIN_API_KEY no configurada');
  const response = await fetch(`${apiUrl}/api/internal/admin-auth/rate-limit`, {
    method: 'POST', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ email: normalizeEmail(email), ip, operation }),
  });
  if (!response.ok && response.status !== 429) throw new Error('No se pudo validar el límite de acceso');
  const data = await response.json() as { allowed?: boolean; retryAfterSeconds?: number };
  return { allowed: response.ok && data.allowed !== false, retryAfterSeconds: data.retryAfterSeconds || 0 };
}

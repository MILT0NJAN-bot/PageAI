import { Request, Response, NextFunction } from 'express';

const WINDOW_MS = 24 * 60 * 60 * 1000;

interface RateRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateRecord>();

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.resetAt < now) store.delete(key);
  }
}, 60 * 60 * 1000);

function createRateLimit(scope: string, maxRequests: number, resourceName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.socket.remoteAddress
      || 'unknown';
    const key = `${scope}:${ip}`;
    const now = Date.now();
    const record = store.get(key);

    if (!record || record.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return next();
    }

    if (record.count >= maxRequests) {
      const hoursLeft = Math.ceil((record.resetAt - now) / (60 * 60 * 1000));
      return res.status(429).json({
        error: `Límite de ${resourceName} alcanzado`,
        message: `Has alcanzado el límite de ${maxRequests} ${resourceName} hoy. Intenta de nuevo en ${hoursLeft} horas.`,
        retryAfterHours: hoursLeft,
      });
    }

    record.count += 1;
    next();
  };
}

// Una preview nunca consume el cupo reservado para generar el sitio completo.
export const rateLimitPreview = createRateLimit('preview', 20, 'vistas previas');
export const rateLimitGenerate = createRateLimit('layout', 5, 'sitios generados');

// middleware/rateLimit.ts
// Limita generaciones por IP — protección simple contra abuso de tokens.
// En memoria para MVP; si escalas a múltiples instancias, migra a Redis.

import { Request, Response, NextFunction } from 'express';

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 horas
const MAX_REQUESTS = 5; // Máximo de generaciones gratis por IP al día

interface RateRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateRecord>();

// Limpieza periódica de registros vencidos para no crecer infinito en memoria
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of store.entries()) {
    if (record.resetAt < now) store.delete(ip);
  }
}, 60 * 60 * 1000); // cada hora

export function rateLimitGenerate(req: Request, res: Response, next: NextFunction) {
  // Detecta IP real considerando proxies (Vercel, nginx, etc.)
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown';

  const now = Date.now();
  const record = store.get(ip);

  if (!record || record.resetAt < now) {
    // Primera solicitud o ventana expirada — reinicia el contador
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    const hoursLeft = Math.ceil((record.resetAt - now) / (60 * 60 * 1000));
    return res.status(429).json({
      error: 'Límite de generaciones alcanzado',
      message: `Has alcanzado el límite de ${MAX_REQUESTS} sitios generados hoy. Intenta de nuevo en ${hoursLeft} horas.`,
      retryAfterHours: hoursLeft,
    });
  }

  record.count += 1;
  next();
}
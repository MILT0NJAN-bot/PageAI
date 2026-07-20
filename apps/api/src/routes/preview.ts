// routes/preview.ts — POST /api/generate-preview
// Genera SOLO el bloque Hero — barato, sin necesidad de capturar lead todavía.

import { Router } from 'express';
import { validate, generateLayoutSchema } from '../middleware/validate';
import { checkLimit, getIpHash, incrementUsage } from '../services/demoSecurity.service';
import { generateHeroPreview } from '../services/ai.service';

export const previewRouter = Router();

previewRouter.post('/', validate(generateLayoutSchema), async (req, res) => {
  const { businessName, sector, features, brandColor, businessProfile } = req.body;

  try {
    const visitorScope = `visitor:${res.locals.visitorId}`; const ipScope = `ip:${getIpHash(req)}`;
    const [visitorLimit, ipLimit] = await Promise.all([checkLimit(visitorScope,'preview',2,24*60*60*1000),checkLimit(ipScope,'preview',5,24*60*60*1000)]);
    if (!visitorLimit.allowed || !ipLimit.allowed) return res.status(429).json({ error:'Límite de previews alcanzado', message:'Puedes generar hasta 2 previews al día. Tus datos permanecen guardados.' });
    console.log(`[preview] Generando preview para "${businessName}" (${sector})`);
    const preview = await generateHeroPreview({ businessName, sector, features, brandColor, businessProfile });
    await Promise.all([incrementUsage(visitorScope,'preview',24*60*60*1000),incrementUsage(ipScope,'preview',24*60*60*1000)]);
    res.json(preview);
  } catch (err: any) {
    console.error('[preview] Error:', err.message);
    res.status(422).json({ error: 'Error al generar preview', detail: err.message });
  }
});

// routes/preview.ts — POST /api/generate-preview
// Genera SOLO el bloque Hero — barato, sin necesidad de capturar lead todavía.

import { Router } from 'express';
import { validate, generateLayoutSchema } from '../middleware/validate';
import { rateLimitGenerate } from '../middleware/rateLimit';
import { generateHeroPreview } from '../services/ai.service';

export const previewRouter = Router();

previewRouter.post('/', rateLimitGenerate, validate(generateLayoutSchema), async (req, res) => {
  const { businessName, sector, features, brandColor } = req.body;

  try {
    console.log(`[preview] Generando preview para "${businessName}" (${sector})`);
    const preview = await generateHeroPreview({ businessName, sector, features, brandColor });
    res.json(preview);
  } catch (err: any) {
    console.error('[preview] Error:', err.message);
    res.status(422).json({ error: 'Error al generar preview', detail: err.message });
  }
});
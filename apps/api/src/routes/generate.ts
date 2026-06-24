// routes/generate.ts — POST /api/generate-layout
import { Router } from 'express';
import { validate, generateLayoutSchema } from '../middleware/validate';
import { rateLimitGenerate } from '../middleware/rateLimit';
import { generateWebsiteLayout } from '../services/ai.service';
import { db } from '../db/client';
import type { Block } from '@shared/types';

export const generateRouter = Router();

generateRouter.post('/', rateLimitGenerate, validate(generateLayoutSchema), async (req, res) => {
  const { businessName, sector, features, brandColor } = req.body;

  try {
    console.log(`[generate] Generando layout para "${businessName}" (${sector})`);
    const aiLayout = await generateWebsiteLayout({ businessName, sector, features, brandColor });

    const blocks: Block[] = aiLayout.blocks.map((b, index) => ({
      id: `block_${Date.now()}_${index}`,
      type: b.type as any,
      order: index,
      isVisible: true,
      data: b.data as any,
    }));

    const project = await db.project.create({
      data: {
        businessName,
        sector,
        features: JSON.stringify(features),
        globalPalette: aiLayout.globalPalette as any,
        blocks: blocks as any,
      },
    });

    console.log(`[generate] Proyecto creado: ${project.id}`);
    res.status(201).json({
      projectId: project.id,
      blocks,
      globalPalette: aiLayout.globalPalette,
    });

  } catch (err: any) {
    console.error('[generate] Error:', err.message);

    if (err.message.includes('OpenAI') || err.message.includes('JSON') || err.message.includes('IA')) {
      return res.status(422).json({ error: 'Error al procesar respuesta de IA', detail: err.message });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// routes/generate.ts — POST /api/generate-layout
import { Router } from 'express';
import { validate, generateLayoutSchema } from '../middleware/validate';
import { rateLimitGenerate } from '../middleware/rateLimit';
import { generateWebsiteLayout } from '../services/ai.service';
import { db } from '../db/client';
import type { Block } from '@shared/types';
import { createCustomFeatureData } from '../services/customFeature.service';

export const generateRouter = Router();

generateRouter.post('/', rateLimitGenerate, validate(generateLayoutSchema), async (req, res) => {
  const { businessName, sector, features, brandColor, logoUrl, customRequest } = req.body;

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

    if (customRequest) {
      blocks.push({
        id: `block_${Date.now()}_custom`,
        type: 'custom_feature',
        order: blocks.length,
        isVisible: true,
        data: createCustomFeatureData(customRequest, aiLayout.globalPalette),
      });
    }

    const project = await db.project.create({
      data: {
        businessName,
        sector,
        features: JSON.stringify(features),
        globalPalette: aiLayout.globalPalette as any,
        blocks: blocks as any,
        logoUrl: logoUrl || null,
        customRequest: customRequest || null,
      },
    });

    console.log(`[generate] Proyecto creado: ${project.id}`);
    res.status(201).json({
      projectId: project.id,
      accessToken: project.accessToken,
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

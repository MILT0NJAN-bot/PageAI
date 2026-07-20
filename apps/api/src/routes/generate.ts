// routes/generate.ts — POST /api/generate-layout
import { Router } from 'express';
import { validate, generateLayoutSchema } from '../middleware/validate';
import { generateWebsiteLayout } from '../services/ai.service';
import { db } from '../db/client';
import type { Block } from '@shared/types';
import { createCustomFeatureData } from '../services/customFeature.service';
import { checkLimit, getIpHash, hashValue, incrementUsage, verifyEmailToken } from '../services/demoSecurity.service';

export const generateRouter = Router();

generateRouter.post('/', validate(generateLayoutSchema), async (req, res) => {
  const { businessName, sector, features, brandColor, logoUrl, customRequest, businessProfile, verificationToken } = req.body;

  try {
    const ownerEmail = verifyEmailToken(verificationToken);
    if (!ownerEmail) return res.status(401).json({ error:'Correo no verificado', message:'Verifica tu correo antes de generar la demo editable.' });
    const existing = await db.project.findFirst({ where:{ ownerEmail, demoExpiresAt:{gt:new Date()}, status:{not:'ARCHIVED'} }, orderBy:{createdAt:'desc'} });
    if (existing) return res.status(409).json({ error:'Ya tienes una demo activa', message:'Recuperamos tu demo existente en lugar de consumir otra generación.', projectId:existing.id, accessToken:existing.accessToken, existing:true });
    const emailScope=`email:${hashValue(ownerEmail)}`; const visitorScope=`visitor:${res.locals.visitorId}`; const ipScope=`ip:${getIpHash(req)}`;
    const limits=await Promise.all([checkLimit(emailScope,'full_demo',1,30*24*60*60*1000),checkLimit(visitorScope,'full_demo',1,30*24*60*60*1000),checkLimit(ipScope,'full_demo',5,24*60*60*1000)]);
    if(limits.some(limit=>!limit.allowed))return res.status(429).json({error:'Límite de demos alcanzado',message:'Solo se permite una demo activa por correo cada 30 días.'});
    console.log(`[generate] Generando layout para "${businessName}" (${sector})`);
    const aiLayout = await generateWebsiteLayout({ businessName, sector, features, brandColor, businessProfile });

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
        businessProfile: businessProfile || undefined,
        ownerEmail,
        demoExpiresAt: new Date(Date.now()+15*24*60*60*1000),
        status: 'DEMO_ACTIVE',
      },
    });

    console.log(`[generate] Proyecto creado: ${project.id}`);
    await Promise.all([incrementUsage(emailScope,'full_demo',30*24*60*60*1000),incrementUsage(visitorScope,'full_demo',30*24*60*60*1000),incrementUsage(ipScope,'full_demo',24*60*60*1000)]);
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

import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/client';

export const leadsRouter = Router();

const leadSchema = z.object({
  businessName: z.string().min(2),
  email: z.string().email('Email invalido'),
  whatsapp: z.string().min(8).optional(),
  sector: z.string(),
});

// POST /api/leads — captura un lead nuevo
leadsRouter.post('/', async (req, res) => {
  const result = leadSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Datos invalidos', details: result.error.flatten().fieldErrors });
  }
  try {
    const lead = await db.lead.create({ data: result.data });
    console.log('[leads] Nuevo lead capturado:', lead.email, '(' + lead.businessName + ')');
    res.status(201).json({ leadId: lead.id });
  } catch (err) {
    console.error('[leads] Error:', err);
    res.status(500).json({ error: 'Error al guardar el contacto' });
  }
});

// GET /api/leads — lista todos los leads (para el panel admin)
leadsRouter.get('/', async (req, res) => {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json({ leads });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener leads' });
  }
});
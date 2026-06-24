// routes/leads.ts — POST /api/leads
// Captura el contacto del cliente antes de generar el sitio completo.

import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/client';

export const leadsRouter = Router();

const leadSchema = z.object({
  businessName: z.string().min(2),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(8, 'Número inválido').optional(),
  sector: z.string(),
});

leadsRouter.post('/', async (req, res) => {
  const result = leadSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten().fieldErrors });
  }

  try {
    const lead = await db.lead.create({ data: result.data });
    console.log(`[leads] Nuevo lead capturado: ${lead.email} (${lead.businessName})`);
    res.status(201).json({ leadId: lead.id });
  } catch (err) {
    console.error('[leads] Error:', err);
    res.status(500).json({ error: 'Error al guardar el contacto' });
  }
});
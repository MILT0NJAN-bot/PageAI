// routes/projects.ts — CRUD de proyectos (MySQL)
import { Router } from 'express';
import { db } from '../db/client';
import { z } from 'zod';
import { requireAdmin, requireProjectAccess, requireEditableDemo } from '../middleware/projectAccess';

export const projectsRouter = Router();

// Helper: parsea features de JSON string a array al devolver el proyecto
function deserializeProject(project: any) {
  return {
    ...project,
    features: typeof project.features === 'string'
      ? JSON.parse(project.features)
      : project.features,
  };
}

// GET /api/projects/:id
projectsRouter.get('/:id', requireProjectAccess, async (req, res) => {
  try {
    const project = await db.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(deserializeProject(project));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
});

// PUT /api/projects/:id — auto-save del editor
projectsRouter.put('/:id', requireEditableDemo, async (req, res) => {
  const updateSchema = z.object({
    blocks:        z.array(z.any()).optional(),
    globalPalette: z.record(z.string()).optional(),
    businessName:  z.string().optional(),
    features:      z.array(z.string()).optional(),
    logoUrl:       z.string().url().max(2048).optional().nullable(),
    customRequest: z.string().max(500).optional().nullable(),
    status: z.enum(['NEW','DEMO_ACTIVE','QUOTE_REQUESTED','DEMO_EXPIRED','CONTACTED','QUOTED','APPROVED','IN_PROGRESS','WAITING_CLIENT','PUBLISHED','ARCHIVED']).optional(),
    adminNotes: z.string().max(5000).optional().nullable(),
    estimatedPrice: z.number().int().nonnegative().optional().nullable(),
    finalPrice: z.number().int().nonnegative().optional().nullable(),
    businessProfile: z.record(z.any()).optional().nullable(),
  });

  const result = updateSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: 'Datos inválidos' });

  try {
    const updated = await db.project.update({
      where: { id: req.params.id },
      data: {
        ...(result.data.blocks        && { blocks: result.data.blocks as any }),
        ...(result.data.globalPalette && { globalPalette: result.data.globalPalette as any }),
        ...(result.data.businessName  && { businessName: result.data.businessName }),
        ...(result.data.features      && { features: JSON.stringify(result.data.features) }),
        ...(result.data.logoUrl !== undefined && { logoUrl: result.data.logoUrl }),
        ...(result.data.customRequest !== undefined && { customRequest: result.data.customRequest }),
        ...(result.data.status !== undefined && { status: result.data.status }),
        ...(result.data.adminNotes !== undefined && { adminNotes: result.data.adminNotes }),
        ...(result.data.estimatedPrice !== undefined && { estimatedPrice: result.data.estimatedPrice }),
        ...(result.data.finalPrice !== undefined && { finalPrice: result.data.finalPrice }),
        ...(result.data.businessProfile !== undefined && { businessProfile: result.data.businessProfile as any }),
      },
    });
    res.json(deserializeProject(updated));
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
});

projectsRouter.post('/:id/request-quote', requireEditableDemo, async (req,res)=>{
  try { const project=await db.project.update({where:{id:req.params.id},data:{status:'QUOTE_REQUESTED',quoteRequestedAt:new Date()}}); res.json({ok:true,status:project.status}); }
  catch { res.status(500).json({error:'No se pudo solicitar la cotización'}); }
});

projectsRouter.post('/:id/reactivate', requireAdmin, async (req,res)=>{
  try { const project=await db.project.update({where:{id:req.params.id},data:{status:'DEMO_ACTIVE',demoExpiresAt:new Date(Date.now()+15*24*60*60*1000)}}); res.json(deserializeProject(project)); }
  catch { res.status(500).json({error:'No se pudo reactivar la demo'}); }
});

// DELETE /api/projects/:id
projectsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

// GET /api/projects — lista paginada
projectsRouter.get('/', requireAdmin, async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [projects, total] = await db.$transaction([
      db.project.findMany({
        skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, businessName: true, sector: true, features: true, logoUrl: true, customRequest: true, businessProfile: true, accessToken: true, status: true, ownerEmail:true, demoExpiresAt:true, quoteRequestedAt:true, estimatedPrice: true, finalPrice: true, createdAt: true, publishedUrl: true },
      }),
      db.project.count(),
    ]);
    res.json({
      projects: projects.map(deserializeProject),
      total, page, totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al listar proyectos' });
  }
});

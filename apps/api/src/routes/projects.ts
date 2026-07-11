// routes/projects.ts — CRUD de proyectos (MySQL)
import { Router } from 'express';
import { db } from '../db/client';
import { z } from 'zod';

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
projectsRouter.get('/:id', async (req, res) => {
  try {
    const project = await db.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(deserializeProject(project));
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
});

// PUT /api/projects/:id — auto-save del editor
projectsRouter.put('/:id', async (req, res) => {
  const updateSchema = z.object({
    blocks:        z.array(z.any()).optional(),
    globalPalette: z.record(z.string()).optional(),
    businessName:  z.string().optional(),
    features:      z.array(z.string()).optional(),
    logoUrl:       z.string().url().max(2048).optional().nullable(),
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
      },
    });
    res.json(deserializeProject(updated));
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
});

// DELETE /api/projects/:id
projectsRouter.delete('/:id', async (req, res) => {
  try {
    await db.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

// GET /api/projects — lista paginada
projectsRouter.get('/', async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 20;
  try {
    const [projects, total] = await db.$transaction([
      db.project.findMany({
        skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, businessName: true, sector: true, features: true, logoUrl: true, createdAt: true, publishedUrl: true },
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

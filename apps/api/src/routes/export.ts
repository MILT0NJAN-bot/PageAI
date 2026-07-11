import { Router } from 'express';
import { db } from '../db/client';
import { exportProjectToHTML } from '../services/export.service';
import type { WebsiteProject } from '@shared/types';

export const exportRouter = Router();

exportRouter.get('/:id/export', async (req, res) => {
  try {
    const project = await db.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Obtiene el logoUrl del query param si viene del frontend
    const logoUrl = req.query.logoUrl as string | undefined;

    const projectData: WebsiteProject & { logoUrl?: string } = {
      ...project,
      features:      typeof project.features === 'string' ? JSON.parse(project.features) : project.features,
      blocks:        project.blocks as any,
      globalPalette: project.globalPalette as any,
      logoUrl:       logoUrl || (project as any).logoUrl || undefined,
    };

    const html     = exportProjectToHTML(projectData);
    const filename = `${project.businessName.toLowerCase().replace(/\s+/g, '-')}-sitio.html`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(html);

  } catch (err) {
    console.error('[export] Error:', err);
    res.status(500).json({ error: 'Error al exportar el proyecto' });
  }
});
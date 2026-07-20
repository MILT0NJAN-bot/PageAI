import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/client';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (process.env.ADMIN_API_KEY && req.header('x-admin-key') === process.env.ADMIN_API_KEY) return next();
  return res.status(401).json({ error: 'Acceso administrativo requerido' });
}

export async function requireProjectAccess(req: Request, res: Response, next: NextFunction) {
  if (process.env.ADMIN_API_KEY && req.header('x-admin-key') === process.env.ADMIN_API_KEY) return next();
  const token = req.header('x-project-token') || String(req.query.token || '');
  if (!token) return res.status(401).json({ error: 'Enlace de acceso inválido' });
  const project = await db.project.findFirst({ where: { id: req.params.id, accessToken: token }, select: { id: true, demoExpiresAt: true } });
  if (!project) return res.status(403).json({ error: 'No tienes acceso a este proyecto' });
  next();
}

export async function requireEditableDemo(req: Request, res: Response, next: NextFunction) {
  if (process.env.ADMIN_API_KEY && req.header('x-admin-key') === process.env.ADMIN_API_KEY) return next();
  const token = req.header('x-project-token') || String(req.query.token || '');
  const project = token ? await db.project.findFirst({ where:{ id:req.params.id, accessToken:token }, select:{ demoExpiresAt:true } }) : null;
  if(!project)return res.status(403).json({error:'No tienes acceso a este proyecto'});
  if(project.demoExpiresAt && project.demoExpiresAt<new Date())return res.status(403).json({error:'Demo vencida',message:'La demo permanece visible, pero necesita reactivación para editarse.'});
  next();
}

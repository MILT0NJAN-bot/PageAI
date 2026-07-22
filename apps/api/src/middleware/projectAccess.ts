import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/client';
import crypto from 'crypto';

function validAdminKey(value?: string) {
  const expected = process.env.ADMIN_API_KEY;
  if (!value || !expected) return false;
  const left = Buffer.from(value); const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (validAdminKey(req.header('x-admin-key'))) return next();
  return res.status(401).json({ error: 'Acceso administrativo requerido' });
}

export async function requireProjectAccess(req: Request, res: Response, next: NextFunction) {
  if (validAdminKey(req.header('x-admin-key'))) return next();
  const token = req.header('x-project-token') || String(req.query.token || '');
  if (!token) return res.status(401).json({ error: 'Enlace de acceso inválido' });
  const project = await db.project.findFirst({ where: { id: req.params.id, accessToken: token }, select: { id: true, demoExpiresAt: true } });
  if (!project) return res.status(403).json({ error: 'No tienes acceso a este proyecto' });
  next();
}

export async function requireEditableDemo(req: Request, res: Response, next: NextFunction) {
  if (validAdminKey(req.header('x-admin-key'))) return next();
  const token = req.header('x-project-token') || String(req.query.token || '');
  const project = token ? await db.project.findFirst({ where:{ id:req.params.id, accessToken:token }, select:{ demoExpiresAt:true } }) : null;
  if(!project)return res.status(403).json({error:'No tienes acceso a este proyecto'});
  if(project.demoExpiresAt && project.demoExpiresAt<new Date())return res.status(403).json({error:'Demo vencida',message:'La demo permanece visible, pero necesita reactivación para editarse.'});
  next();
}

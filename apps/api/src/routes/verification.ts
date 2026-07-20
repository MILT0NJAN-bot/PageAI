import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { db } from '../db/client';
import { checkLimit, createEmailToken, hashValue, incrementUsage, sendVerificationEmail } from '../services/demoSecurity.service';

export const verificationRouter = Router();
verificationRouter.post('/request', async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Correo inválido' });
  const email = parsed.data.email.toLowerCase(); const scope = `email:${hashValue(email)}`; const limit = await checkLimit(scope, 'verification', 3, 24*60*60*1000);
  if (!limit.allowed) return res.status(429).json({ error: 'Demasiados códigos solicitados. Intenta mañana.' });
  const code = crypto.randomInt(100000, 999999).toString();
  await db.emailVerification.create({ data: { email, codeHash: hashValue(`${email}:${code}`), expiresAt: new Date(Date.now()+10*60*1000) } });
  const sent = await sendVerificationEmail(email, code); await incrementUsage(scope, 'verification', 24*60*60*1000);
  res.json({ sent, ...(process.env.NODE_ENV !== 'production' && !sent ? { devCode: code } : {}) });
});

verificationRouter.post('/verify', async (req, res) => {
  const parsed = z.object({ email:z.string().email(), code:z.string().regex(/^\d{6}$/) }).safeParse(req.body); if(!parsed.success)return res.status(400).json({error:'Código inválido'});
  const email=parsed.data.email.toLowerCase(); const record=await db.emailVerification.findFirst({where:{email},orderBy:{createdAt:'desc'}});
  if(!record||record.expiresAt<new Date()||record.verifiedAt)return res.status(400).json({error:'El código venció o ya fue utilizado'});
  if(record.attempts>=5)return res.status(429).json({error:'Demasiados intentos'});
  if(record.codeHash!==hashValue(`${email}:${parsed.data.code}`)){await db.emailVerification.update({where:{id:record.id},data:{attempts:{increment:1}}});return res.status(400).json({error:'Código incorrecto'});}
  await db.emailVerification.update({where:{id:record.id},data:{verifiedAt:new Date()}}); res.json({verificationToken:createEmailToken(email)});
});

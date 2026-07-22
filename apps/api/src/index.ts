// apps/api/src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { generateRouter } from './routes/generate';
import { projectsRouter } from './routes/projects';
import { previewRouter }  from './routes/preview';
import { leadsRouter }    from './routes/leads';
import { uploadRouter }   from './routes/upload';
import { exportRouter }   from './routes/export';
import { verificationRouter } from './routes/verification';
import { internalRouter } from './routes/internal';
import { visitorCookie } from './services/demoSecurity.service';

const app = express();
const PORT = process.env.PORT || 3001;
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(visitorCookie);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use('/api/generate-layout',  generateRouter);
app.use('/api/projects',         projectsRouter);
app.use('/api/generate-preview', previewRouter);
app.use('/api/leads',            leadsRouter);
app.use('/api/upload-logo',      uploadRouter);
app.use('/api/projects',         exportRouter);  // GET /api/projects/:id/export
app.use('/api/verification',     verificationRouter);
app.use('/api/internal',         internalRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT} — ${new Date().toISOString()}`);
});

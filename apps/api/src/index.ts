// apps/api/src/index.ts — Entry point del servidor Express
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { generateRouter } from './routes/generate';
import { projectsRouter } from './routes/projects';
import { previewRouter } from './routes/preview';
import { leadsRouter } from './routes/leads';
import { uploadRouter } from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Sirve los logos subidos como archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use('/api/generate-layout',  generateRouter);
app.use('/api/projects',         projectsRouter);
app.use('/api/generate-preview', previewRouter);
app.use('/api/leads',            leadsRouter);
app.use('/api/upload-logo',      uploadRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
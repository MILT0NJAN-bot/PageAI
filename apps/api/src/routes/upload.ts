// routes/upload.ts — POST /api/upload-logo
// Sube un logo a almacenamiento local. Nivel simple: no se analiza con IA,
// solo se guarda y se referencia por URL en el bloque Hero.

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadRouter = Router();

const UPLOAD_DIR = path.join(__dirname, '../../uploads/logos');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `logo_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Formato no soportado. Usa PNG, JPG, SVG o WebP.'));
    }
    cb(null, true);
  },
});

uploadRouter.post('/', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });

  // URL pública para servir el logo — se sirve estáticamente desde index.ts
  const logoUrl = `/uploads/logos/${req.file.filename}`;
  res.status(201).json({ logoUrl });
});

// Manejador de errores específico de Multer (tamaño, formato)
uploadRouter.use((err: any, _req: any, res: any, _next: any) => {
  res.status(400).json({ error: err.message || 'Error al subir el archivo' });
});
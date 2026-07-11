// middleware/validate.ts — Validación con Zod antes de llegar a los handlers
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data; // Datos limpios y validados
    next();
  };

// Esquema de validación para el endpoint de generación
export const generateLayoutSchema = z.object({
  businessName: z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres').trim(),
  sector: z.enum(['beauty', 'restaurant', 'fitness', 'retail', 'professional', 'education']),
  features: z.array(z.enum(['booking', 'gallery', 'services_list', 'social', 'whatsapp',
                              'menu', 'reservations', 'location', 'pricing', 'testimonials']))
              .min(0).max(10),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color HEX inválido').optional(),
  logoUrl: z.string().url('URL de logo inválida').max(2048).optional().nullable(),
});

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
  customRequest: z.string().trim().max(500, 'La solicitud especial es demasiado larga').optional(),
  verificationToken: z.string().min(20).max(2000).optional(),
  businessProfile: z.object({
    description: z.string().trim().min(20).max(1000),
    primaryGoal: z.enum(['whatsapp','calls','appointments','services','sales','menu','quotes','trust','store_visits']),
    targetAudience: z.string().trim().max(500),
    differentiator: z.string().trim().max(500),
    primaryAction: z.string().trim().min(2).max(100),
    visualStyle: z.enum(['elegant','modern','minimal','premium','corporate','youthful','artisan','colorful']),
    colorMode: z.enum(['light','dark','auto']),
    communicationTone: z.enum(['professional','friendly','elegant','fun','inspiring','direct','technical']),
    avoidColors: z.string().max(200).optional(), referenceUrl: z.string().url().max(500).optional().or(z.literal('')),
    services: z.array(z.object({ name: z.string().trim().min(2).max(100), description: z.string().max(300).optional(), price: z.string().max(50).optional() })).min(1).max(8),
    whatsapp: z.string().max(30).optional(), phone: z.string().max(30).optional(), email: z.string().email().optional().or(z.literal('')),
    address: z.string().max(300).optional(), city: z.string().max(100).optional(), hours: z.string().max(300).optional(), socialMedia: z.string().max(500).optional(),
    photos: z.array(z.string().url().max(2048)).max(8).optional(),
    serviceArea: z.string().max(300).optional(), requiredPhrase: z.string().max(300).optional(), currentPromotion: z.string().max(300).optional(),
    contentRules: z.array(z.string().max(100)).max(10),
  }).optional(),
});

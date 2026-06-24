// db/seed.ts — MySQL: features se guarda como JSON string (no array nativo)
import 'dotenv/config';
import { db } from './client';

async function seed() {
  const project = await db.project.create({
    data: {
      businessName: 'Salón Valentina',
      sector: 'beauty',
      features: JSON.stringify(['booking', 'gallery', 'social']), // ← JSON string para MySQL
      globalPalette: { primary: '#D4A5A5', secondary: '#F5E6E8', background: '#FFF9F9', text: '#2D2D2D' },
      blocks: [
        {
          id: 'block_hero_1',
          type: 'hero',
          order: 0,
          isVisible: true,
          data: {
            headline: 'Tu belleza, nuestra pasión',
            subheadline: 'Salón de belleza premium en el corazón de la ciudad.',
            ctaText: 'Agendar cita',
            ctaUrl: '#contacto',
            backgroundColor: '#FFF9F9',
            textColor: '#2D2D2D',
            accentColor: '#D4A5A5',
          },
        },
        {
          id: 'block_services_1',
          type: 'services',
          order: 1,
          isVisible: true,
          data: {
            title: 'Nuestros Servicios',
            subtitle: 'Tratamientos de belleza diseñados para ti',
            backgroundColor: '#F5E6E8',
            textColor: '#2D2D2D',
            accentColor: '#D4A5A5',
            cardBackgroundColor: '#FFFFFF',
            layout: 'grid',
            items: [
              { id: 'svc_1', icon: '💅', title: 'Manicure & Pedicure', description: 'Tratamiento completo para tus manos y pies.' },
              { id: 'svc_2', icon: '✂️', title: 'Corte y Peinado',     description: 'Estilistas expertos para el look que siempre quisiste.' },
              { id: 'svc_3', icon: '🌿', title: 'Tratamientos Faciales', description: 'Limpieza e hidratación profunda para una piel radiante.' },
            ],
          },
        },
      ],
    },
  });

  console.log('✅ Seed creado:', project.id);
  await db.$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });

// lib/pricing.ts
// Calculadora de precio estimado — VALORES DE EJEMPLO, edítalos a tu gusto.

import type { Sector, Feature } from '@shared/types';

// Precio base por sector (complejidad de contenido típica)
export const BASE_PRICE_BY_SECTOR: Record<Sector, number> = {
  beauty:       2500,
  restaurant:   2800,
  fitness:      2600,
  retail:       3200,
  professional: 2400,
  education:    2700,
};

// Costo adicional por cada funcionalidad seleccionada
export const FEATURE_PRICE: Record<Feature, number> = {
  booking:        600,
  gallery:        300,
  services_list:  250,
  social:         150,
  whatsapp:       200,
  menu:           400,
  reservations:   600,
  location:       250,
  pricing:        300,
  testimonials:   300,
};

export const CURRENCY = 'MXN'; // Cambia a tu moneda local

export interface PriceBreakdown {
  base: number;
  featuresTotal: number;
  featureLines: Array<{ feature: Feature; label: string; price: number }>;
  customFeaturePrice: number;
  total: number;
}

const FEATURE_LABELS: Record<Feature, string> = {
  booking:        'Agenda de citas',
  gallery:        'Galería de fotos',
  services_list:  'Lista de servicios',
  social:         'Integración redes sociales',
  whatsapp:       'Botón de WhatsApp',
  menu:           'Menú digital',
  reservations:   'Sistema de reservaciones',
  location:       'Mapa de ubicación',
  pricing:        'Tabla de precios',
  testimonials:   'Sección de testimonios',
};

export function calculatePrice(sector: Sector, features: Feature[], customRequest?: string): PriceBreakdown {
  const base = BASE_PRICE_BY_SECTOR[sector];

  const featureLines = features.map(f => ({
    feature: f,
    label: FEATURE_LABELS[f],
    price: FEATURE_PRICE[f] ?? 0,
  }));

  const featuresTotal = featureLines.reduce((sum, f) => sum + f.price, 0);
  const customFeaturePrice = customRequest?.trim() ? 1500 : 0;

  return {
    base,
    featuresTotal,
    featureLines,
    customFeaturePrice,
    total: base + featuresTotal + customFeaturePrice,
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
  }).format(amount);
}

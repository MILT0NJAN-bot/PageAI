// services/ai.service.ts
// Toda la lógica de integración con OpenAI centralizada aquí.

import OpenAI from 'openai';
import type { AIGeneratedLayout, Sector, Feature } from '@shared/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── System Prompt — el contrato exacto que la IA debe cumplir ──
const SYSTEM_PROMPT = `
Eres un diseñador web experto en branding, UX y marketing digital.
Tu única función es generar contenido y paletas de color para sitios web de negocios locales.

REGLAS ABSOLUTAS — violarlas hará que la respuesta sea rechazada:
1. Responde ÚNICAMENTE con un objeto JSON válido. Sin texto adicional, sin markdown, sin bloques de código.
2. TODOS los colores DEBEN ser códigos HEX válidos de exactamente 7 caracteres: #RRGGBB.
3. Contraste de colores: textColor debe ser legible sobre backgroundColor (ratio WCAG mínimo 4.5:1).
   - Si backgroundColor es oscuro (#1A1A1A, #2D2D2D, etc), usa textColor claro (#FFFFFF, #F5F5F5).
   - Si backgroundColor es claro (#FFFFFF, #FFF9F9, etc), usa textColor oscuro (#1A1A1A, #2D2D2D).
4. Los textos deben ser ESPECÍFICOS al negocio y sector — absolutamente nunca genéricos o placeholder.
5. El campo "type" de cada bloque debe ser exactamente: "hero", "services", "gallery", "contact", "pricing", o "testimonials".
6. Genera exactamente los bloques solicitados en el array "blocksToGenerate".

PALETAS RECOMENDADAS POR SECTOR:
- beauty: rosas suaves, dorados, tonos piel, neutros elegantes
- restaurant: terracotas, verdes oliva, cremas, marrones cálidos
- fitness: negros, naranjas energéticos, rojos, blancos fuertes
- retail: azules modernos, blancos limpios, contrastes fuertes
- professional: azul marino, gris, blanco, acentos dorados
- education: azules amigables, verdes, amarillos cálidos

ESQUEMA JSON REQUERIDO — sigue esta estructura exacta:
{
  "globalPalette": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "background": "#HEX",
    "text": "#HEX"
  },
  "blocks": [
    {
      "type": "hero",
      "data": {
        "headline": "Texto impactante máximo 8 palabras",
        "subheadline": "Una o dos oraciones descriptivas y específicas del negocio",
        "ctaText": "Texto del botón máximo 4 palabras",
        "ctaUrl": "#contacto",
        "backgroundColor": "#HEX",
        "textColor": "#HEX",
        "accentColor": "#HEX"
      }
    },
    {
      "type": "services",
      "data": {
        "title": "Título de sección",
        "subtitle": "Subtítulo descriptivo",
        "backgroundColor": "#HEX",
        "textColor": "#HEX",
        "accentColor": "#HEX",
        "cardBackgroundColor": "#HEX",
        "layout": "grid",
        "items": [
          { "id": "svc_1", "icon": "emoji", "title": "Nombre servicio", "description": "Descripción de 2-3 oraciones específica." },
          { "id": "svc_2", "icon": "emoji", "title": "Nombre servicio", "description": "Descripción de 2-3 oraciones específica." },
          { "id": "svc_3", "icon": "emoji", "title": "Nombre servicio", "description": "Descripción de 2-3 oraciones específica." }
        ]
      }
    },
    {
      "type": "contact",
      "data": {
        "title": "Título del formulario",
        "subtitle": "Subtítulo invitando a contactar",
        "buttonText": "Texto del botón",
        "buttonColor": "#HEX",
        "backgroundColor": "#HEX",
        "textColor": "#HEX",
        "accentColor": "#HEX",
        "showPhone": true,
        "showEmail": true,
        "showAddress": false,
        "formFields": ["name", "email", "phone", "message"]
      }
    }
  ]
}
`.trim();

// ── Mapa: feature → tipo de bloque a solicitar ─────────────────
const FEATURE_TO_BLOCK_TYPE: Record<string, string> = {
  gallery:      'gallery',
  booking:      'contact',
  menu:         'services',
  reservations: 'contact',
  pricing:      'pricing',
  testimonials: 'testimonials',
  services_list:'services',
};

// ── Validador de HEX ───────────────────────────────────────────
const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

function isValidHex(val: unknown): val is string {
  return typeof val === 'string' && HEX_REGEX.test(val);
}

// Valida recursivamente todos los campos que terminan en "Color"
function validateColors(obj: any, path = ''): string[] {
  const errors: string[] = [];
  if (!obj || typeof obj !== 'object') return errors;

  for (const [key, val] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (key.toLowerCase().endsWith('color') || key === 'primary' || key === 'secondary' || key === 'background' || key === 'text') {
      if (!isValidHex(val)) errors.push(`${currentPath}: "${val}" no es un HEX válido`);
    }
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      errors.push(...validateColors(val, currentPath));
    }
    if (Array.isArray(val)) {
      val.forEach((item, i) => errors.push(...validateColors(item, `${currentPath}[${i}]`)));
    }
  }
  return errors;
}

// ── Función principal de generación (sitio completo) ───────────

export async function generateWebsiteLayout(params: {
  businessName: string;
  sector: Sector;
  features: Feature[];
  brandColor?: string;
}): Promise<AIGeneratedLayout> {
  const { businessName, sector, features, brandColor } = params;

  const blocksToGenerate = [
    'hero',
    'services',
    ...new Set(features.map(f => FEATURE_TO_BLOCK_TYPE[f]).filter(Boolean)),
  ].slice(0, 6);

  const colorInstruction = brandColor
    ? `\nColor de marca OBLIGATORIO: ${brandColor}. Usa este HEX exacto como "primary" en globalPalette y como "accentColor" en todos los bloques. Construye el resto de la paleta (secondary, background, text) en armonía con este color, respetando las reglas de contraste WCAG.`
    : '';

  const userPrompt = `
Negocio: "${businessName}"
Sector: ${sector}
Bloques a generar: ${blocksToGenerate.join(', ')}
${colorInstruction}

Genera contenido auténtico, específico y atractivo para "${businessName}".
Adapta el tono y vocabulario al sector "${sector}".
La paleta de colores debe ser coherente con la identidad del sector.
  `.trim();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt },
    ],
    temperature: 0.75,
    max_tokens: 2500,
  });

  const rawText = completion.choices[0].message.content;
  if (!rawText) throw new Error('OpenAI devolvió respuesta vacía');

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`JSON inválido de OpenAI: ${rawText.slice(0, 200)}`);
  }

  const colorErrors = validateColors(parsed);
  if (colorErrors.length > 0) {
    throw new Error(`Colores inválidos en respuesta de IA: ${colorErrors.join(', ')}`);
  }

  if (!parsed.globalPalette || !Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
    throw new Error('Estructura JSON de IA incompleta: faltan globalPalette o blocks');
  }

  if (brandColor) {
    parsed.globalPalette.primary = brandColor;
  }

  return parsed as AIGeneratedLayout;
}

// ── Generación liviana: solo el bloque Hero (para preview gratis) ──

export async function generateHeroPreview(params: {
  businessName: string;
  sector: Sector;
  features: Feature[];
  brandColor?: string;
}): Promise<{ globalPalette: AIGeneratedLayout['globalPalette']; hero: any }> {
  const { businessName, sector, brandColor } = params;

  const colorInstruction = brandColor
    ? `\nColor de marca OBLIGATORIO: ${brandColor}. Úsalo como "primary" y como "accentColor" del Hero.`
    : '';

  const userPrompt = `
Negocio: "${businessName}"
Sector: ${sector}
${colorInstruction}

Genera SOLAMENTE un bloque "hero" con headline, subheadline, ctaText, ctaUrl y los colores.
También incluye globalPalette completa.
Responde con este JSON exacto:
{
  "globalPalette": { "primary": "#HEX", "secondary": "#HEX", "background": "#HEX", "text": "#HEX" },
  "blocks": [
    { "type": "hero", "data": { "headline": "...", "subheadline": "...", "ctaText": "...", "ctaUrl": "#contacto", "backgroundColor": "#HEX", "textColor": "#HEX", "accentColor": "#HEX" } }
  ]
}
  `.trim();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt },
    ],
    temperature: 0.75,
    max_tokens: 600,
  });

  const rawText = completion.choices[0].message.content;
  if (!rawText) throw new Error('OpenAI devolvió respuesta vacía');

  const parsed = JSON.parse(rawText);
  const colorErrors = validateColors(parsed);
  if (colorErrors.length > 0) throw new Error(`Colores inválidos: ${colorErrors.join(', ')}`);

  if (brandColor) parsed.globalPalette.primary = brandColor;

  return { globalPalette: parsed.globalPalette, hero: parsed.blocks[0].data };
}
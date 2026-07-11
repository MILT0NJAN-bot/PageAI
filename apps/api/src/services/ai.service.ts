import OpenAI from 'openai';
import type { AIGeneratedLayout, Sector, Feature } from '@shared/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Eres un diseñador web senior y copywriter experto en marketing digital para negocios locales.
Tu misión es generar sitios web VISUALMENTE IMPRESIONANTES y con CONTENIDO RICO Y ESPECÍFICO.

REGLAS ABSOLUTAS:
1. Responde ÚNICAMENTE con JSON válido. Sin texto, sin markdown, sin explicaciones.
2. TODOS los colores deben ser HEX de 7 caracteres exactos: #RRGGBB
3. CONTRASTE OBLIGATORIO:
   - Fondo oscuro (#111, #1A1A2E, etc) → texto claro (#FFFFFF, #F0F0F0)
   - Fondo claro (#FFF, #F5F5F5, etc) → texto oscuro (#1A1A1A, #2D2D2D)
4. Genera contenido ESPECÍFICO y AUTÉNTICO para el negocio — nunca genérico.
5. Cada item de servicios debe tener descripción de al menos 3 oraciones detalladas.
6. Los testimonios deben ser creíbles, específicos y variados (diferentes perfiles de clientes).
7. Para restaurantes/comida: usa nombres de platillos específicos y apetitosos.
8. Para belleza: usa términos del sector (hidratación, keratina, nail art, etc).
9. Para fitness: usa lenguaje motivacional y técnico apropiado.

PALETAS PREMIUM POR SECTOR (úsalas como inspiración):
- beauty: rose gold (#C9A96E, #F8E8E8, #2D1B1B), lavender luxury (#7B5EA7, #F3EEFF, #1A0A2E)
- restaurant: terracotta warmth (#C1440E, #FFF8F0, #1A0800), mediterranean (#2E7D5E, #F0FFF8, #0A1A14)
- fitness: power dark (#FF6B35, #0A0A0A, #1A1A1A), electric blue (#0066FF, #000814, #001233)
- retail: luxury minimal (#C9A96E, #FAFAFA, #0A0A0A), bold modern (#FF3366, #FAFAFA, #0A0A0A)
- professional: corporate trust (#1E3A5F, #F8FAFC, #0A1628), emerald authority (#065F46, #F0FDF4, #022C22)
- education: vibrant learn (#7C3AED, #FAF5FF, #1E0A3C), warm knowledge (#D97706, #FFFBEB, #1C0A00)

ESQUEMA JSON — genera EXACTAMENTE esta estructura:
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
        "headline": "Frase impactante de máximo 7 palabras con gancho emocional",
        "subheadline": "Dos oraciones que describan el valor único del negocio y por qué elegirlos sobre la competencia.",
        "ctaText": "Verbo de acción + beneficio (máx 4 palabras)",
        "ctaUrl": "#contacto",
        "secondaryCtaText": "Ver servicios",
        "secondaryCtaUrl": "#servicios",
        "backgroundColor": "#HEX",
        "textColor": "#HEX",
        "accentColor": "#HEX"
      }
    },
    {
      "type": "services",
      "data": {
        "title": "Título atractivo de la sección (no solo 'Servicios')",
        "subtitle": "Oración que genere deseo o curiosidad sobre los servicios",
        "backgroundColor": "#HEX",
        "textColor": "#HEX",
        "accentColor": "#HEX",
        "cardBackgroundColor": "#HEX",
        "layout": "grid",
        "items": [
          {
            "id": "svc_1",
            "icon": "emoji_relevante",
            "title": "Nombre específico del servicio",
            "description": "Descripción detallada de 3 oraciones: qué incluye, cómo se realiza, y qué beneficio obtiene el cliente.",
            "price": "desde $XXX"
          },
          {
            "id": "svc_2",
            "icon": "emoji_relevante",
            "title": "Nombre específico del servicio",
            "description": "Descripción detallada de 3 oraciones: qué incluye, cómo se realiza, y qué beneficio obtiene el cliente.",
            "price": "desde $XXX"
          },
          {
            "id": "svc_3",
            "icon": "emoji_relevante",
            "title": "Nombre específico del servicio",
            "description": "Descripción detallada de 3 oraciones: qué incluye, cómo se realiza, y qué beneficio obtiene el cliente.",
            "price": "desde $XXX"
          },
          {
            "id": "svc_4",
            "icon": "emoji_relevante",
            "title": "Cuarto servicio relevante",
            "description": "Descripción detallada de 3 oraciones.",
            "price": "desde $XXX"
          }
        ]
      }
    },
    {
      "type": "testimonials",
      "data": {
        "title": "Lo que dicen quienes ya confiaron en nosotros",
        "subtitle": "Experiencias reales de clientes satisfechos",
        "backgroundColor": "#HEX",
        "textColor": "#HEX",
        "accentColor": "#HEX",
        "cardBackgroundColor": "#HEX",
        "items": [
          {
            "id": "t1",
            "name": "Nombre Apellido real",
            "role": "Perfil específico del cliente",
            "text": "Testimonio creíble de 2-3 oraciones mencionando un resultado concreto y específico que obtuvo.",
            "rating": 5
          },
          {
            "id": "t2",
            "name": "Nombre Apellido real",
            "role": "Perfil específico del cliente",
            "text": "Testimonio diferente al anterior, con otro ángulo del servicio.",
            "rating": 5
          },
          {
            "id": "t3",
            "name": "Nombre Apellido real",
            "role": "Perfil específico del cliente",
            "text": "Tercer testimonio con enfoque en la experiencia personal.",
            "rating": 5
          }
        ]
      }
    },
    {
      "type": "contact",
      "data": {
        "title": "Titulo invitador para el formulario",
        "subtitle": "Oracion que reduzca la friccion y motive al contacto",
        "buttonText": "CTA especifico del sector",
        "buttonColor": "#HEX",
        "backgroundColor": "#HEX",
        "textColor": "#HEX",
        "accentColor": "#HEX",
        "cardBackgroundColor": "#FFFFFF",
        "showPhone": true,
        "showEmail": true,
        "showAddress": false,
        "formFields": ["name", "email", "phone", "message"]
      }
    }
  ]
}
`.trim();

const FEATURE_TO_BLOCK_TYPE: Record<string, string> = {
  gallery:       'gallery',
  booking:       'contact',
  menu:          'services',
  reservations:  'contact',
  pricing:       'pricing',
  testimonials:  'testimonials',
  services_list: 'services',
};

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

function isValidHex(val: unknown): val is string {
  return typeof val === 'string' && HEX_REGEX.test(val);
}

// Campos que se llaman "text" pero NO son colores HEX
const NON_COLOR_TEXT_FIELDS = new Set(['text', 'title', 'subtitle', 'headline',
  'subheadline', 'description', 'ctaText', 'buttonText', 'name', 'role',
  'caption', 'alt', 'icon', 'id', 'period', 'price', 'ctaUrl',
  'secondaryCtaText', 'secondaryCtaUrl', 'phone', 'email', 'address',
  'layout', 'publishedUrl', 'businessName', 'sector']);

function validateColors(obj: any, path = ''): string[] {
  const errors: string[] = [];
  if (!obj || typeof obj !== 'object') return errors;

  for (const [key, val] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    const isColorField =
      // termina en "Color" (backgroundColor, accentColor, etc)
      key.toLowerCase().endsWith('color') ||
      // es una clave de paleta global (primary, secondary, background)
      // pero NO "text" dentro de un item (testimonios, servicios)
      (['primary', 'secondary', 'background'].includes(key)) ||
      // "text" solo es color cuando está directamente en globalPalette o en data de bloque
      // no cuando está dentro de un array item (testimonios, servicios, galería)
      (key === 'text' && !path.includes('['));

    if (isColorField && !NON_COLOR_TEXT_FIELDS.has(key) || 
        (key === 'text' && !path.includes('[') && !NON_COLOR_TEXT_FIELDS.has(path.split('.').pop() || ''))) {
      if (typeof val === 'string' && !isValidHex(val)) {
        errors.push(`${currentPath}: "${val}" no es HEX valido`);
      }
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
    'testimonials',
    ...new Set(features.map(f => FEATURE_TO_BLOCK_TYPE[f]).filter(Boolean)),
    'contact',
  ].slice(0, 6);

  const colorInstruction = brandColor
    ? `\nCOLOR DE MARCA OBLIGATORIO: ${brandColor}. Usa este HEX exacto como "primary" y como "accentColor" en TODOS los bloques. El resto de la paleta debe armonizar con este color manteniendo contraste WCAG AA minimo.`
    : '';

  const userPrompt = `
Negocio: "${businessName}"
Sector: ${sector}
Bloques a generar: ${blocksToGenerate.join(', ')}
${colorInstruction}

INSTRUCCIONES ESPECIFICAS:
- Genera contenido 100% autentico y especifico para "${businessName}"
- El headline del Hero debe ser memorable y unico para este negocio
- Los servicios deben tener nombres reales del sector ${sector}, no genericos
- Los precios de servicios deben ser realistas para Mexico (MXN)
- Los testimonios deben mencionar resultados concretos y sonar naturales
- La paleta debe transmitir la personalidad del sector: ${sector}
- Genera SIEMPRE 4 servicios minimo
- Genera SIEMPRE 3 testimonios
`.trim();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 3500,
  });

  const rawText = completion.choices[0].message.content;
  if (!rawText) throw new Error('OpenAI devolvio respuesta vacia');

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`JSON invalido de OpenAI: ${rawText.slice(0, 200)}`);
  }

  const colorErrors = validateColors(parsed);
  if (colorErrors.length > 0) {
    throw new Error(`Colores invalidos: ${colorErrors.join(', ')}`);
  }

  if (!parsed.globalPalette || !Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
    throw new Error('Estructura JSON incompleta');
  }

  if (brandColor) {
    parsed.globalPalette.primary = brandColor;
  }

  return parsed as AIGeneratedLayout;
}

export async function generateHeroPreview(params: {
  businessName: string;
  sector: Sector;
  features: Feature[];
  brandColor?: string;
}): Promise<{ globalPalette: AIGeneratedLayout['globalPalette']; hero: any }> {
  const { businessName, sector, brandColor } = params;

  const colorInstruction = brandColor
    ? `\nCOLOR DE MARCA: ${brandColor}. Usalo como primary y accentColor.`
    : '';

  const userPrompt = `
Negocio: "${businessName}"
Sector: ${sector}
${colorInstruction}

Genera SOLO el bloque hero con contenido especifico e impactante para "${businessName}".
Responde con este JSON exacto:
{
  "globalPalette": { "primary": "#HEX", "secondary": "#HEX", "background": "#HEX", "text": "#HEX" },
  "blocks": [
    { "type": "hero", "data": {
      "headline": "Frase impactante maxima 7 palabras",
      "subheadline": "Dos oraciones de valor especifico para ${businessName}",
      "ctaText": "CTA con verbo de accion",
      "ctaUrl": "#contacto",
      "backgroundColor": "#HEX",
      "textColor": "#HEX",
      "accentColor": "#HEX"
    }}
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
    temperature: 0.8,
    max_tokens: 800,
  });

  const rawText = completion.choices[0].message.content;
  if (!rawText) throw new Error('OpenAI devolvio respuesta vacia');

  const parsed = JSON.parse(rawText);
  const colorErrors = validateColors(parsed);
  if (colorErrors.length > 0) throw new Error(`Colores invalidos: ${colorErrors.join(', ')}`);
  if (brandColor) parsed.globalPalette.primary = brandColor;

  return { globalPalette: parsed.globalPalette, hero: parsed.blocks[0].data };
}
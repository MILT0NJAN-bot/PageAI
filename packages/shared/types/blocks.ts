// packages/shared/types/blocks.ts
// Tipos TypeScript compartidos entre frontend y backend.
// Son la "fuente de verdad" del contrato de datos del sistema.

// ── Enums de dominio ───────────────────────────────────────────

export type Sector =
  | 'beauty'
  | 'restaurant'
  | 'fitness'
  | 'retail'
  | 'professional'
  | 'education';

export type Feature =
  | 'booking'
  | 'gallery'
  | 'services_list'
  | 'social'
  | 'whatsapp'
  | 'menu'
  | 'reservations'
  | 'location'
  | 'pricing'
  | 'testimonials';

export type BlockType =
  | 'hero'
  | 'services'
  | 'gallery'
  | 'contact'
  | 'pricing'
  | 'testimonials'
  | 'location'
  | 'social_links'
  | 'custom_feature';

export type CustomModule = 'login' | 'dashboard' | 'appointments' | 'orders' | 'memberships' | 'courses' | 'quotes' | 'catalog' | 'custom';

// ── Data shapes para cada bloque ───────────────────────────────

export interface ServiceItem {
  id: string;
  icon: string;         // Emoji o nombre de icono (ej: "💅", "scissors")
  title: string;
  description: string;
  price?: string;       // Opcional: "desde $500"
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar?: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;       // "mes", "sesión", etc.
  features: string[];
  isHighlighted: boolean;
  ctaText: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

// ── Block data interfaces ───────────────────────────────────────

export interface BaseBlockData {
  backgroundColor: string;  // HEX: "#FFFFFF"
  textColor: string;         // HEX: "#1A1A1A"
  accentColor: string;       // HEX: "#3B82F6"
}

export interface HeroBlockData extends BaseBlockData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
  overlayOpacity?: number;   // 0-1
}

export interface ServicesBlockData extends BaseBlockData {
  title: string;
  subtitle: string;
  items: ServiceItem[];
  cardBackgroundColor: string;
  layout: 'grid' | 'list';
}

export interface GalleryBlockData extends BaseBlockData {
  title: string;
  subtitle: string;
  images: GalleryImage[];
  columns: 2 | 3 | 4;
}

export interface ContactBlockData extends BaseBlockData {
  title: string;
  subtitle: string;
  cardBackgroundColor?: string;
  buttonText: string;
  buttonColor: string;
  showPhone: boolean;
  showEmail: boolean;
  showAddress: boolean;
  phone?: string;
  email?: string;
  address?: string;
  formFields: Array<'name' | 'email' | 'phone' | 'message' | 'date'>;
}

export interface PricingBlockData extends BaseBlockData {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
  cardBackgroundColor: string;
}

export interface TestimonialsBlockData extends BaseBlockData {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
  cardBackgroundColor: string;
}

export interface CustomFeatureBlockData extends BaseBlockData {
  title: string;
  description: string;
  request: string;
  modules: CustomModule[];
  demoNotice: string;
  loginButtonText: string;
}

// ── Block: unión discriminada tipada ───────────────────────────
// Permite al compilador saber exactamente qué está en `data`
// según el valor de `type`, sin necesidad de casteos.

export type Block =
  | { id: string; type: 'hero';         order: number; isVisible: boolean; data: HeroBlockData }
  | { id: string; type: 'services';     order: number; isVisible: boolean; data: ServicesBlockData }
  | { id: string; type: 'gallery';      order: number; isVisible: boolean; data: GalleryBlockData }
  | { id: string; type: 'contact';      order: number; isVisible: boolean; data: ContactBlockData }
  | { id: string; type: 'pricing';      order: number; isVisible: boolean; data: PricingBlockData }
  | { id: string; type: 'testimonials'; order: number; isVisible: boolean; data: TestimonialsBlockData }
  | { id: string; type: 'custom_feature'; order: number; isVisible: boolean; data: CustomFeatureBlockData };

// ── Global palette ─────────────────────────────────────────────

export interface GlobalPalette {
  primary: string;     // Color dominante (botones, accents)
  secondary: string;   // Color complementario
  background: string;  // Fondo de la página
  text: string;        // Texto principal
}

// ── Proyecto completo ───────────────────────────────────────────

export interface WebsiteProject {
  id: string;
  businessName: string;
  sector: Sector;
  features: Feature[];
  blocks: Block[];
  globalPalette: GlobalPalette;
  logoUrl?: string;
  customRequest?: string;
  accessToken?: string;
  status?: 'NEW' | 'CONTACTED' | 'QUOTED' | 'APPROVED' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'PUBLISHED' | 'ARCHIVED';
  adminNotes?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  publishedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Payload del formulario de onboarding ───────────────────────

export interface OnboardingPayload {
  businessName: string;
  sector: Sector;
  features: Feature[];
  brandColor?: string;
  logoUrl?: string;
  customRequest?: string;
}

// ── Respuesta de la IA (contrato del prompt) ───────────────────
// Esta interfaz define EXACTAMENTE lo que el prompt debe generar.

export interface AIGeneratedLayout {
  globalPalette: GlobalPalette;
  blocks: Array<{
    type: BlockType;
    data: HeroBlockData | ServicesBlockData | GalleryBlockData |
          ContactBlockData | PricingBlockData | TestimonialsBlockData | CustomFeatureBlockData;
  }>;
}

import type { CustomFeatureBlockData, CustomModule, GlobalPalette } from '@shared/types';

const RULES: Array<{ module: CustomModule; terms: string[] }> = [
  { module: 'login', terms: ['login', 'inicio de sesion', 'iniciar sesion', 'acceso', 'contraseña', 'cuenta'] },
  { module: 'dashboard', terms: ['panel', 'dashboard', 'area de cliente', 'perfil'] },
  { module: 'appointments', terms: ['cita', 'agenda', 'reservacion', 'turno'] },
  { module: 'orders', terms: ['pedido', 'orden', 'envio', 'seguimiento'] },
  { module: 'memberships', terms: ['membresia', 'suscripcion', 'socio'] },
  { module: 'courses', terms: ['curso', 'leccion', 'clase', 'alumno'] },
  { module: 'quotes', terms: ['cotizador', 'cotizacion', 'presupuesto'] },
  { module: 'catalog', terms: ['catalogo', 'producto', 'carrito', 'tienda'] },
];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function createCustomFeatureData(request: string, palette: GlobalPalette): CustomFeatureBlockData {
  const normalized = normalize(request);
  const modules = RULES.filter(rule => rule.terms.some(term => normalized.includes(term))).map(rule => rule.module);
  const uniqueModules = [...new Set<CustomModule>(modules.length ? modules : ['custom'])];

  if (uniqueModules.includes('dashboard') && !uniqueModules.includes('login')) uniqueModules.unshift('login');

  return {
    title: 'Tu experiencia personalizada',
    description: 'Así podría verse la función especial integrada con la identidad de tu negocio.',
    request,
    modules: uniqueModules,
    demoNotice: 'Demostración visual. La funcionalidad, seguridad y precio final requieren revisión antes del desarrollo.',
    loginButtonText: 'Iniciar sesión',
    backgroundColor: palette.background,
    textColor: palette.text,
    accentColor: palette.primary,
  };
}

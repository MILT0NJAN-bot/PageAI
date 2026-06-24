// components/onboarding/OnboardingForm.tsx
'use client';

import { useState } from 'react';
import type { Sector, Feature } from '@shared/types';
import { useRouter } from 'next/navigation';
import { ColorPicker } from './ColorPicker';
import { LogoUpload } from './LogoUpload';

// ── Datos estáticos del formulario ─────────────────────────────

const SECTORS: { value: Sector; label: string; icon: string; description: string }[] = [
  { value: 'beauty',       label: 'Belleza & Spa',    icon: '💅', description: 'Salón, estética, spa' },
  { value: 'restaurant',   label: 'Restaurante',      icon: '🍽️', description: 'Comida, café, bar' },
  { value: 'fitness',      label: 'Fitness & Salud',  icon: '💪', description: 'Gym, yoga, nutrición' },
  { value: 'retail',       label: 'Tienda / Retail',  icon: '🛍️', description: 'Ropa, productos, hogar' },
  { value: 'professional', label: 'Servicios Prof.',  icon: '💼', description: 'Consultoría, legal, contable' },
  { value: 'education',    label: 'Educación',        icon: '📚', description: 'Academia, clases, cursos' },
];

const FEATURES_BY_SECTOR: Record<Sector, { value: Feature; label: string; icon: string }[]> = {
  beauty: [
    { value: 'booking',       label: 'Agendar Citas',       icon: '📅' },
    { value: 'gallery',       label: 'Galería de Trabajos', icon: '🖼️' },
    { value: 'services_list', label: 'Lista de Servicios',  icon: '📋' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
    { value: 'whatsapp',      label: 'Botón WhatsApp',      icon: '💬' },
    { value: 'testimonials',  label: 'Reseñas de Clientes', icon: '⭐' },
  ],
  restaurant: [
    { value: 'menu',          label: 'Menú Digital',        icon: '🍴' },
    { value: 'reservations',  label: 'Reservaciones',       icon: '📅' },
    { value: 'gallery',       label: 'Fotos del Lugar',     icon: '🖼️' },
    { value: 'location',      label: 'Ubicación / Mapa',    icon: '📍' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
    { value: 'testimonials',  label: 'Reseñas',             icon: '⭐' },
  ],
  fitness: [
    { value: 'booking',       label: 'Agendar Clases',      icon: '📅' },
    { value: 'pricing',       label: 'Planes y Precios',    icon: '💰' },
    { value: 'gallery',       label: 'Galería',             icon: '🖼️' },
    { value: 'testimonials',  label: 'Testimonios',         icon: '⭐' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
    { value: 'whatsapp',      label: 'WhatsApp',            icon: '💬' },
  ],
  retail: [
    { value: 'gallery',       label: 'Catálogo de Productos', icon: '🖼️' },
    { value: 'whatsapp',      label: 'Comprar por WhatsApp',  icon: '💬' },
    { value: 'social',        label: 'Redes Sociales',        icon: '📱' },
    { value: 'location',      label: 'Ubicación de Tienda',   icon: '📍' },
    { value: 'testimonials',  label: 'Reseñas',               icon: '⭐' },
  ],
  professional: [
    { value: 'services_list', label: 'Servicios',           icon: '📋' },
    { value: 'booking',       label: 'Agendar Consulta',    icon: '📅' },
    { value: 'testimonials',  label: 'Casos de Éxito',      icon: '⭐' },
    { value: 'pricing',       label: 'Planes / Tarifas',    icon: '💰' },
    { value: 'social',        label: 'LinkedIn / Redes',    icon: '📱' },
  ],
  education: [
    { value: 'services_list', label: 'Cursos y Programas',  icon: '📚' },
    { value: 'pricing',       label: 'Inscripciones',       icon: '💰' },
    { value: 'booking',       label: 'Clase de Prueba',     icon: '📅' },
    { value: 'gallery',       label: 'Galería',             icon: '🖼️' },
    { value: 'testimonials',  label: 'Testimonios',         icon: '⭐' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
  ],
};

// ── Componente ─────────────────────────────────────────────────

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep]                 = useState<1 | 2 | 3 | 4 | 5>(1);
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector]             = useState<Sector | null>(null);
  const [features, setFeatures]         = useState<Feature[]>([]);
  const [brandColor, setBrandColor]     = useState<string | null>(null);
  const [logoUrl, setLogoUrl]           = useState<string | null>(null);

  const toggleFeature = (f: Feature) =>
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleSectorChange = (s: Sector) => {
    setSector(s);
    setFeatures([]);
  };

  const handleGoToSummary = () => {
    if (!sector || !businessName || !brandColor) return;
    sessionStorage.setItem('onboarding_draft', JSON.stringify({
      businessName, sector, features, brandColor, logoUrl,
    }));
    router.push('/onboarding/resumen');
  };

  const availableFeatures = sector ? FEATURES_BY_SECTOR[sector] : [];
  const canGoToStep2 = businessName.trim().length >= 2;
  const canGoToStep3 = !!sector;
  const canGoToStep4 = canGoToStep3 && features.length >= 1;
  const canSubmit     = canGoToStep4 && !!brandColor;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Barra de progreso */}
      <div className="flex border-b border-slate-100">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className={`flex-1 py-3 text-center text-xs sm:text-sm font-medium transition-colors
            ${step >= s ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
            {s === 1 && '① Nombre'}
            {s === 2 && '② Sector'}
            {s === 3 && '③ Funciones'}
            {s === 4 && '④ Color'}
            {s === 5 && '⑤ Logo'}
          </div>
        ))}
      </div>

      <div className="p-8">
        {/* PASO 1: Nombre del negocio */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Cómo se llama tu negocio?</h2>
            <p className="text-slate-500 mb-8">Lo usaremos para personalizar todo tu sitio.</p>
            <input
              type="text"
              autoFocus
              placeholder="Ej: Salón Valentina, Tacos El Gordo, Studio Fit..."
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canGoToStep2 && setStep(2)}
              className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 
                         focus:border-blue-500 focus:outline-none text-lg transition-colors"
            />
            <button
              onClick={() => setStep(2)}
              disabled={!canGoToStep2}
              className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-semibold
                         text-lg disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-blue-700 transition-colors"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* PASO 2: Selección de sector */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Cuál es tu sector?</h2>
            <p className="text-slate-500 mb-8">Elegimos la paleta de colores y contenido apropiados para tu industria.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {SECTORS.map(s => (
                <button
                  key={s.value}
                  onClick={() => handleSectorChange(s.value)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 
                    transition-all duration-200 text-left hover:shadow-md
                    ${sector === s.value
                      ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                      : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <span className="text-3xl">{s.icon}</span>
                  <span className="font-semibold text-slate-900 text-sm">{s.label}</span>
                  <span className="text-xs text-slate-400 text-center">{s.description}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                ← Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canGoToStep3}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold
                           disabled:opacity-40 hover:bg-blue-700 transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: Funcionalidades */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Qué necesita tu sitio?</h2>
            <p className="text-slate-500 mb-8">Selecciona todas las funciones que quieras incluir.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
              {availableFeatures.map(f => (
                <label key={f.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                    transition-all hover:shadow-sm
                    ${features.includes(f.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'}`}>
                  <input
                    type="checkbox"
                    checked={features.includes(f.value)}
                    onChange={() => toggleFeature(f.value)}
                    className="sr-only"
                  />
                  <span className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0
                    ${features.includes(f.value) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                    {features.includes(f.value) && <span className="text-white text-xs">✓</span>}
                  </span>
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-medium text-slate-800">{f.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                ← Atrás
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canGoToStep4}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold
                           disabled:opacity-40 hover:bg-blue-700 transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: Color de marca */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Elige tu color de marca</h2>
            <p className="text-slate-500 mb-8">Usaremos este color como base para toda la paleta de tu sitio.</p>

            <ColorPicker value={brandColor} onChange={setBrandColor} />

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(3)} className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                ← Atrás
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!canSubmit}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg
                           disabled:opacity-40 disabled:cursor-not-allowed
                           hover:bg-blue-700 transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* PASO 5: Logo (opcional) */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Tienes un logo?</h2>
            <p className="text-slate-500 mb-8">
              Opcional — si no subes uno, generaremos tu sitio sin logo y podrás agregarlo después.
            </p>

            <LogoUpload value={logoUrl} onChange={setLogoUrl} />

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(4)} className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                ← Atrás
              </button>
              <button
                onClick={handleGoToSummary}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Ver resumen y cotización →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
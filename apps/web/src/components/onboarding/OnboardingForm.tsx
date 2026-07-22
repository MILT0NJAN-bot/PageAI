'use client';

import { useState } from 'react';
import type { Sector, Feature } from '@shared/types';
import { useRouter } from 'next/navigation';
import { ColorPicker } from './ColorPicker';
import { LogoUpload } from './LogoUpload';
import { BusinessProfileForm, EMPTY_BUSINESS_PROFILE } from './BusinessProfileForm';

const SECTORS: { value: Sector; label: string; icon: string; description: string }[] = [
  { value: 'beauty',       label: 'Belleza & Spa',    icon: '💅', description: 'Salon, estetica, spa' },
  { value: 'restaurant',   label: 'Restaurante',      icon: '🍽️', description: 'Comida, cafe, bar' },
  { value: 'fitness',      label: 'Fitness & Salud',  icon: '💪', description: 'Gym, yoga, nutricion' },
  { value: 'retail',       label: 'Tienda / Retail',  icon: '🛍️', description: 'Ropa, productos, hogar' },
  { value: 'professional', label: 'Servicios Prof.',  icon: '💼', description: 'Consultoria, legal, contable' },
  { value: 'education',    label: 'Educacion',        icon: '📚', description: 'Academia, clases, cursos' },
];

const FEATURES_BY_SECTOR: Record<Sector, { value: Feature; label: string; icon: string }[]> = {
  beauty: [
    { value: 'booking',       label: 'Agendar Citas',       icon: '📅' },
    { value: 'gallery',       label: 'Galeria de Trabajos', icon: '🖼️' },
    { value: 'services_list', label: 'Lista de Servicios',  icon: '📋' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
    { value: 'whatsapp',      label: 'Boton WhatsApp',      icon: '💬' },
    { value: 'testimonials',  label: 'Resenas de Clientes', icon: '⭐' },
  ],
  restaurant: [
    { value: 'menu',          label: 'Menu Digital',        icon: '🍴' },
    { value: 'reservations',  label: 'Reservaciones',       icon: '📅' },
    { value: 'gallery',       label: 'Fotos del Lugar',     icon: '🖼️' },
    { value: 'location',      label: 'Ubicacion / Mapa',    icon: '📍' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
    { value: 'testimonials',  label: 'Resenas',             icon: '⭐' },
  ],
  fitness: [
    { value: 'booking',       label: 'Agendar Clases',      icon: '📅' },
    { value: 'pricing',       label: 'Planes y Precios',    icon: '💰' },
    { value: 'gallery',       label: 'Galeria',             icon: '🖼️' },
    { value: 'testimonials',  label: 'Testimonios',         icon: '⭐' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
    { value: 'whatsapp',      label: 'WhatsApp',            icon: '💬' },
  ],
  retail: [
    { value: 'gallery',       label: 'Catalogo de Productos', icon: '🖼️' },
    { value: 'whatsapp',      label: 'Comprar por WhatsApp',  icon: '💬' },
    { value: 'social',        label: 'Redes Sociales',        icon: '📱' },
    { value: 'location',      label: 'Ubicacion de Tienda',   icon: '📍' },
    { value: 'testimonials',  label: 'Resenas',               icon: '⭐' },
  ],
  professional: [
    { value: 'services_list', label: 'Servicios',           icon: '📋' },
    { value: 'booking',       label: 'Agendar Consulta',    icon: '📅' },
    { value: 'testimonials',  label: 'Casos de Exito',      icon: '⭐' },
    { value: 'pricing',       label: 'Planes / Tarifas',    icon: '💰' },
    { value: 'social',        label: 'LinkedIn / Redes',    icon: '📱' },
  ],
  education: [
    { value: 'services_list', label: 'Cursos y Programas',  icon: '📚' },
    { value: 'pricing',       label: 'Inscripciones',       icon: '💰' },
    { value: 'booking',       label: 'Clase de Prueba',     icon: '📅' },
    { value: 'gallery',       label: 'Galeria',             icon: '🖼️' },
    { value: 'testimonials',  label: 'Testimonios',         icon: '⭐' },
    { value: 'social',        label: 'Redes Sociales',      icon: '📱' },
  ],
};

const STEP_LABELS = ['Nombre', 'Sector', 'Funciones', 'Color', 'Tu negocio', 'Logo'];

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep]                 = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector]             = useState<Sector | null>(null);
  const [features, setFeatures]         = useState<Feature[]>([]);
  const [brandColor, setBrandColor]     = useState<string | null>(null);
  const [logoUrl, setLogoUrl]           = useState<string | null>(null);
  const [customRequest, setCustomRequest] = useState('');
  const [businessProfile, setBusinessProfile] = useState(EMPTY_BUSINESS_PROFILE);

  const toggleFeature = (f: Feature) =>
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleSectorChange = (s: Sector) => { setSector(s); setFeatures([]); };

  const handleGoToSummary = () => {
    if (!sector || !businessName || !brandColor) return;
    sessionStorage.setItem('onboarding_draft', JSON.stringify({
      businessName, sector, features, brandColor, logoUrl, customRequest: customRequest.trim() || undefined, businessProfile,
    }));
    router.push('/onboarding/resumen');
  };

  const availableFeatures = sector ? FEATURES_BY_SECTOR[sector] : [];
  const canGoToStep2 = businessName.trim().length >= 2;
  const canGoToStep3 = !!sector;
  const canGoToStep4 = canGoToStep3 && features.length >= 1;
  const canGoToStep5 = canGoToStep4 && !!brandColor;

  return (
    <div className="onboarding-flow min-h-screen bg-[#080b14] text-white">
      {/* Header con progreso */}
      <div className="sticky top-0 z-10 border-b border-white/[.07] bg-[#080b14]/85 backdrop-blur-2xl">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-[.14em] text-[#7f879a]">
              Paso <span className="text-white">{step}</span> / 6
            </span>
            <span className="text-xs font-semibold uppercase tracking-[.14em] text-[#a8f46a]">{STEP_LABELS[step - 1]}</span>
          </div>
          {/* Barra de progreso */}
          <div className="h-[2px] overflow-hidden bg-white/10">
            <div
              className="h-full bg-[#6578ff] transition-all duration-500"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">

        {/* PASO 1 */}
        {step === 1 && (
          <div>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Empecemos
              </div>
              <h1 className="text-4xl font-black mb-3 tracking-tight">
                Como se llama tu negocio?
              </h1>
              <p className="text-slate-400 text-lg">Lo usaremos para personalizar cada texto de tu sitio.</p>
            </div>
            <input
              type="text"
              autoFocus
              placeholder="Ej: Salon Valentina, Tacos El Gordo, Studio Fit..."
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canGoToStep2 && setStep(2)}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xl placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors mb-6"
            />
            {businessName.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
                <span className="text-2xl">👋</span>
                <p className="text-blue-300 text-sm">
                  Genial, crearemos el sitio perfecto para <span className="font-bold text-white">{businessName}</span>
                </p>
              </div>
            )}
            <button
              onClick={() => setStep(2)}
              disabled={!canGoToStep2}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              Continuar
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Sector
              </div>
              <h1 className="text-4xl font-black mb-3 tracking-tight">Cual es tu sector?</h1>
              <p className="text-slate-400 text-lg">Esto define el estilo visual y el contenido que generara la IA.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {SECTORS.map((s, index) => (
                <button
                  key={s.value}
                  onClick={() => handleSectorChange(s.value)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all hover:scale-[1.02]
                    ${sector === s.value
                      ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'}`}
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[.03] font-mono text-xs text-[#a8f46a]">0{index + 1}</span>
                  <div>
                    <p className="font-bold text-white text-sm">{s.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.description}</p>
                  </div>
                  {sector === s.value && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-4 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 transition-colors font-medium">
                Atras
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canGoToStep3}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg disabled:opacity-30 transition-all hover:scale-[1.02]"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <div>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Funcionalidades
              </div>
              <h1 className="text-4xl font-black mb-3 tracking-tight">Que necesita tu sitio?</h1>
              <p className="text-slate-400 text-lg">Cada funcion que elijas aumenta el precio estimado.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 mb-8">
              {availableFeatures.map((f, index) => (
                <label
                  key={f.value}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01]
                    ${features.includes(f.value)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}
                >
                  <input
                    type="checkbox"
                    checked={features.includes(f.value)}
                    onChange={() => toggleFeature(f.value)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${features.includes(f.value) ? 'bg-blue-600 border-blue-600' : 'border-white/20'}`}>
                    {features.includes(f.value) && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="flex-shrink-0 font-mono text-xs text-[#777d86]">0{index + 1}</span>
                  <span className="font-medium text-white">{f.label}</span>
                  {features.includes(f.value) && (
                    <span className="ml-auto text-xs text-blue-400 font-medium">Incluido</span>
                  )}
                </label>
              ))}
            </div>
            {features.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <span className="text-slate-400 text-sm">{features.length} funcion{features.length !== 1 ? 'es' : ''} seleccionada{features.length !== 1 ? 's' : ''}</span>
                <span className="text-blue-400 text-sm font-medium">Ver precio en el resumen</span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-4 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 transition-colors font-medium">
                Atras
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canGoToStep4}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg disabled:opacity-30 transition-all hover:scale-[1.02]"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* PASO 4 */}
        {step === 4 && (
          <div>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Identidad visual
              </div>
              <h1 className="text-4xl font-black mb-3 tracking-tight">Elige tu color de marca</h1>
              <p className="text-slate-400 text-lg">La IA construira toda la paleta en armonia con este color.</p>
            </div>
            {brandColor && (
              <div className="mb-6 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex-shrink-0 shadow-lg" style={{ backgroundColor: brandColor }} />
                <div>
                  <p className="font-semibold text-white">Color seleccionado</p>
                  <p className="text-slate-400 font-mono text-sm">{brandColor}</p>
                </div>
              </div>
            )}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
              <ColorPicker value={brandColor} onChange={setBrandColor} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-6 py-4 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 transition-colors font-medium">
                Atras
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!canGoToStep5}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg disabled:opacity-30 transition-all hover:scale-[1.02]"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* PASO 5 */}
        {step === 5 && sector && <div><div className="mb-8"><h1 className="text-4xl font-black mb-3">Cuéntanos más de tu negocio</h1><p className="text-slate-400">Responde lo esencial ahora; la personalización adicional es opcional.</p></div><BusinessProfileForm value={businessProfile} onChange={setBusinessProfile} sector={sector} features={features}/><div className="flex gap-3 mt-8"><button onClick={()=>setStep(4)} className="px-6 py-4 border border-white/10 rounded-2xl text-slate-400">Atrás</button><button onClick={()=>setStep(6)} disabled={businessProfile.description.trim().length<20||!businessProfile.services.some(s=>s.name.trim().length>=2)} className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold disabled:opacity-30">Continuar</button></div></div>}

        {/* PASO 6 */}
        {step === 6 && (
          <div>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                Ultimo paso
              </div>
              <h1 className="text-4xl font-black mb-3 tracking-tight">Tienes un logo?</h1>
              <p className="text-slate-400 text-lg">Opcional — si no tienes, generamos el sitio sin logo y lo agregas despues.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
              <LogoUpload value={logoUrl} onChange={setLogoUrl} />
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="font-bold">¿Necesitas alguna función especial?</h2>
                <span className="text-xs text-slate-500">Opcional</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">La IA preparará una propuesta visual para que podamos revisarla y cotizar su desarrollo.</p>
              <textarea
                value={customRequest}
                onChange={e => setCustomRequest(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="Ej: Agrega inicio de sesión y un panel donde mis clientes consulten sus citas..."
                className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500"><span>Generaremos una demostración, no la función definitiva.</span><span>{customRequest.length}/500</span></div>
            </div>
            {logoUrl && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain rounded" />
                <div>
                  <p className="text-green-400 font-semibold text-sm">Logo cargado correctamente</p>
                  <p className="text-slate-500 text-xs">Se integrara en tu sitio web</p>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep(5)} className="px-6 py-4 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/5 transition-colors font-medium">
                Atras
              </button>
              <button
                onClick={handleGoToSummary}
                className="flex-1 py-4 text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] hover:opacity-90"
                style={{ backgroundColor: brandColor || '#3B82F6' }}
              >
                Ver resumen y cotizacion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

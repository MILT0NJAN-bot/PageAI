'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import type { Sector, Feature } from '@shared/types';

interface DraftData {
  businessName: string;
  sector: Sector;
  features: Feature[];
  brandColor: string;
  logoUrl?: string;
}

interface HeroPreview {
  globalPalette: { primary: string; secondary: string; background: string; text: string };
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

const SECTOR_LABELS: Record<Sector, string> = {
  beauty: 'Belleza & Spa', restaurant: 'Restaurante', fitness: 'Fitness & Salud',
  retail: 'Tienda / Retail', professional: 'Servicios Profesionales', education: 'Educación',
};

export default function ResumenPage() {
  const router = useRouter();
  const [draft, setDraft]                       = useState<DraftData | null>(null);
  const [preview, setPreview]                   = useState<HeroPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [showLeadForm, setShowLeadForm]         = useState(false);
  const [email, setEmail]                       = useState('');
  const [whatsapp, setWhatsapp]                 = useState('');
  const [isGenerating, setIsGenerating]         = useState(false);
  const [error, setError]                       = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const saved = sessionStorage.getItem('onboarding_draft');
    if (!saved) { router.replace('/onboarding'); return; }
    const parsedDraft: DraftData = JSON.parse(saved);
    setDraft(parsedDraft);

    fetch(`${apiUrl}/api/generate-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedDraft),
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(setPreview)
      .catch(() => setError('No pudimos generar tu preview. Intenta de nuevo.'))
      .finally(() => setIsLoadingPreview(false));
  }, [router, apiUrl]);

  if (!draft) return null;

  const price = calculatePrice(draft.sector, draft.features);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: draft.businessName, email, whatsapp: whatsapp || undefined, sector: draft.sector }),
      });
      handleGenerateFull();
    } catch {
      setError('No pudimos guardar tus datos. Intenta de nuevo.');
    }
  };

  const handleGenerateFull = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/api/generate-layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('Error al generar');
      const { projectId } = await res.json();
      sessionStorage.removeItem('onboarding_draft');

      // Pasa el logoUrl como query param al editor
      const params = new URLSearchParams();
      if (draft.logoUrl) params.set('logoUrl', draft.logoUrl);
      router.push(`/editor/${projectId}${draft.logoUrl ? `?${params}` : ''}`);
    } catch {
      setError('Hubo un error al generar tu sitio. Intenta de nuevo.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4 border border-green-200">
            ✓ Configuración completa
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Así se ve tu sitio</h1>
          <p className="text-slate-500">Vista previa generada con IA — desbloquea el sitio completo para editarlo</p>
        </div>

        {/* Preview del Hero */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          {isLoadingPreview ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              <p className="text-sm text-slate-400">Generando tu vista previa con IA...</p>
            </div>
          ) : preview ? (
            <div style={{ backgroundColor: preview.hero.backgroundColor, color: preview.hero.textColor }} className="px-8 py-16 text-center">
              {draft.logoUrl && (
                <img src={draft.logoUrl} alt="Logo" className="h-16 object-contain mx-auto mb-6" />
              )}
              <h2 className="text-3xl font-bold mb-3">{preview.hero.headline}</h2>
              <p className="text-base opacity-85 mb-6 max-w-md mx-auto">{preview.hero.subheadline}</p>
              <span style={{ backgroundColor: preview.hero.accentColor, color: '#FFFFFF' }} className="inline-block px-6 py-3 rounded-full font-semibold text-sm">
                {preview.hero.ctaText}
              </span>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-red-400 text-sm">
              No se pudo cargar el preview
            </div>
          )}

          {!isLoadingPreview && preview && (
            <div className="bg-slate-50 px-8 py-4 text-center border-t border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                🔒 Tu sitio completo incluye {price.featureLines.length + 2} secciones más
              </p>
            </div>
          )}
        </div>

        {/* Desglose de precio */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Desglose de cotización</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Sitio base ({SECTOR_LABELS[draft.sector]})</span>
                <span className="font-medium text-slate-900">{formatPrice(price.base)}</span>
              </div>
              {price.featureLines.map(f => (
                <div key={f.feature} className="flex justify-between text-sm">
                  <span className="text-slate-600">+ {f.label}</span>
                  <span className="font-medium text-slate-900">{formatPrice(f.price)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-semibold text-slate-900">Total estimado</span>
              <span className="text-3xl font-bold" style={{ color: draft.brandColor }}>{formatPrice(price.total)}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">* Precio estimado. La cotización final puede variar.</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg text-center">{error}</p>}

        {!showLeadForm ? (
          <div className="flex gap-3">
            <button onClick={() => router.push('/onboarding')} className="px-6 py-4 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">
              ← Editar
            </button>
            <button
              onClick={() => setShowLeadForm(true)}
              disabled={isLoadingPreview || !preview}
              className="flex-1 py-4 text-white rounded-xl font-semibold text-lg disabled:opacity-50"
              style={{ backgroundColor: draft.brandColor }}
            >
              Desbloquear sitio completo →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitLead} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-1">Casi listo</h3>
            <p className="text-sm text-slate-500 mb-5">Déjanos tu contacto y generamos tu sitio completo y editable.</p>
            <div className="space-y-3 mb-5">
              <input type="email" required placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none" />
              <input type="tel" placeholder="WhatsApp (opcional)" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none" />
            </div>
            <button type="submit" disabled={isGenerating} className="w-full py-4 text-white rounded-xl font-semibold text-lg disabled:opacity-50"
              style={{ backgroundColor: draft.brandColor }}>
              {isGenerating ? '✨ Generando tu sitio completo...' : 'Generar mi sitio completo →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
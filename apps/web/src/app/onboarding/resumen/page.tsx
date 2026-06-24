// app/onboarding/resumen/page.tsx
// Pantalla intermedia: resumen del sitio + precio estimado, antes de generar con IA

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
}

const SECTOR_LABELS: Record<Sector, string> = {
  beauty: 'Belleza & Spa', restaurant: 'Restaurante', fitness: 'Fitness & Salud',
  retail: 'Tienda / Retail', professional: 'Servicios Profesionales', education: 'Educación',
};

export default function ResumenPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('onboarding_draft');
    if (!saved) { router.replace('/onboarding'); return; }
    setDraft(JSON.parse(saved));
  }, [router]);

  if (!draft) return null;

  const price = calculatePrice(draft.sector, draft.features);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/generate-layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: draft.businessName,
          sector: draft.sector,
          features: draft.features,
          brandColor: draft.brandColor,
        }),
      });
      if (!res.ok) throw new Error('Error al generar');
      const { projectId } = await res.json();
      sessionStorage.removeItem('onboarding_draft');
      router.push(`/editor/${projectId}`);
    } catch {
      setError('Hubo un error al generar tu sitio. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4 border border-green-200">
            ✓ Configuración completa
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Resumen de tu sitio</h1>
          <p className="text-slate-500">Revisa los detalles antes de generar tu sitio con IA</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          {/* Header con color de marca */}
          <div className="p-6 flex items-center gap-4 border-b border-slate-100" style={{ backgroundColor: `${draft.brandColor}10` }}>
            <span className="w-12 h-12 rounded-xl shadow-inner flex-shrink-0" style={{ backgroundColor: draft.brandColor }} />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{draft.businessName}</h2>
              <p className="text-sm text-slate-500">{SECTOR_LABELS[draft.sector]}</p>
            </div>
          </div>

          {/* Desglose de precio */}
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Desglose de cotización
            </h3>
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
              <span className="text-3xl font-bold" style={{ color: draft.brandColor }}>
                {formatPrice(price.total)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              * Precio estimado. La cotización final puede variar según requerimientos específicos.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg text-center">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/onboarding')}
            className="px-6 py-4 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
          >
            ← Editar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-4 text-white rounded-xl font-semibold text-lg disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: draft.brandColor }}
          >
            {isLoading ? '✨ Generando tu sitio con IA...' : 'Generar mi sitio web →'}
          </button>
        </div>
      </div>
    </div>
  );
}
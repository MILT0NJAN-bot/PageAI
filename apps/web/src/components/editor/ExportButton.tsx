'use client';

import { useState } from 'react';

interface ExportButtonProps {
  projectId: string;
  businessName: string;
  logoUrl?: string;
}

export function ExportButton({ projectId, businessName, logoUrl }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Pasa el logoUrl como query param para que el exportador lo incluya en el HTML
      const params = new URLSearchParams();
      if (logoUrl) params.set('logoUrl', logoUrl);

      const url = `${apiUrl}/api/projects/${projectId}/export${logoUrl ? `?${params}` : ''}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error('Error al exportar');

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-sitio.html`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      alert('Error al exportar el sitio. Intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700
                 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
          Exportando...
        </>
      ) : (
        '⬇ Descargar HTML'
      )}
    </button>
  );
}
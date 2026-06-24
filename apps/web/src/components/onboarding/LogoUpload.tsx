// components/onboarding/LogoUpload.tsx
// Subida de logo opcional — guardado local, sin análisis de IA (nivel simple)

'use client';

import { useState, useRef } from 'react';

interface LogoUploadProps {
  value: string | null;          // URL del logo ya subido
  onChange: (logoUrl: string | null) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch(`${apiUrl}/api/upload-logo`, { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al subir el logo');
      }
      const { logoUrl } = await res.json();
      // Guarda la URL completa (host + path) para usarla luego en el Hero
      onChange(`${apiUrl}${logoUrl}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 
                     flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/30
                     transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span className="text-sm text-slate-500">Subiendo...</span>
            </>
          ) : (
            <>
              <span className="text-3xl">🖼️</span>
              <span className="text-sm font-medium text-slate-700">Subir tu logo (opcional)</span>
              <span className="text-xs text-slate-400">PNG, JPG, SVG o WebP — máx 5MB</span>
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-xl">
          <img src={value} alt="Logo" className="w-16 h-16 object-contain rounded-lg bg-slate-50" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Logo cargado</p>
            <p className="text-xs text-slate-400">Se usará en tu sitio</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Quitar
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
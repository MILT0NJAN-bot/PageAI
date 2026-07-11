'use client';

import { useState, useRef } from 'react';

interface LogoUploadProps {
  value: string | null;
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
      const res = await fetch(`${apiUrl}/api/upload-logo`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al subir el logo');
      }

      const { logoUrl } = await res.json();

      // Construye URL absoluta para evitar el error de next/image con rutas relativas
      const absoluteUrl = logoUrl.startsWith('http')
        ? logoUrl
        : `${apiUrl}${logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`}`;

      onChange(absoluteUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
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
                     flex flex-col items-center gap-3 hover:border-blue-400 hover:bg-blue-50/30
                     transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isUploading ? (
            <>
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span className="text-sm text-slate-500 font-medium">Subiendo logo...</span>
            </>
          ) : (
            <>
              <span className="text-4xl">🖼️</span>
              <span className="text-sm font-semibold text-slate-700">Subir tu logo</span>
              <span className="text-xs text-slate-400">PNG, JPG, SVG o WebP — máx 5MB</span>
              <span className="text-xs text-blue-500 font-medium">Opcional — se puede omitir</span>
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-4 p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl">
          {/* img normal en vez de next/image — evita error con URLs externas/absolutas */}
          <img
            src={value}
            alt="Logo subido"
            className="w-16 h-16 object-contain rounded-lg bg-white border border-slate-200 p-1"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">✓ Logo cargado correctamente</p>
            <p className="text-xs text-slate-500 mt-0.5">Se mostrará en tu sitio web</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
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

      {error && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
// components/onboarding/ColorPicker.tsx
// Selector de color de marca: paleta predefinida + opción personalizada

'use client';

import { useState } from 'react';

interface ColorOption {
  hex: string;
  name: string;
}

const PRESET_COLORS: ColorOption[] = [
  { hex: '#3B82F6', name: 'Azul' },
  { hex: '#10B981', name: 'Verde' },
  { hex: '#F59E0B', name: 'Ámbar' },
  { hex: '#EF4444', name: 'Rojo' },
  { hex: '#8B5CF6', name: 'Violeta' },
  { hex: '#EC4899', name: 'Rosa' },
  { hex: '#14B8A6', name: 'Turquesa' },
  { hex: '#78350F', name: 'Café' },
];

interface ColorPickerProps {
  value: string | null;
  onChange: (hex: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customHex, setCustomHex] = useState('#3B82F6');

  const isPreset = PRESET_COLORS.some(c => c.hex === value);

  return (
    <div>
      {/* Grid de colores predefinidos */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {PRESET_COLORS.map(color => (
          <button
            key={color.hex}
            onClick={() => { setCustomMode(false); onChange(color.hex); }}
            className={`group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
              ${value === color.hex && !customMode
                ? 'border-slate-900 shadow-md scale-105'
                : 'border-slate-200 hover:border-slate-300'}`}
          >
            <span
              className="w-10 h-10 rounded-full shadow-inner ring-1 ring-black/5"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-xs text-slate-500 group-hover:text-slate-700">{color.name}</span>
          </button>
        ))}
      </div>

      {/* Opción personalizada */}
      <button
        onClick={() => { setCustomMode(true); onChange(customHex); }}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all
          ${customMode || (!isPreset && value)
            ? 'border-slate-900 bg-slate-50'
            : 'border-dashed border-slate-300 hover:border-slate-400'}`}
      >
        <span
          className="w-8 h-8 rounded-full ring-1 ring-black/10 flex-shrink-0"
          style={{ backgroundColor: customHex }}
        />
        <span className="text-sm font-medium text-slate-700 flex-1 text-left">
          Color personalizado
        </span>
        {(customMode || (!isPreset && value)) && (
          <input
            type="color"
            value={customHex}
            onClick={e => e.stopPropagation()}
            onChange={e => {
              setCustomHex(e.target.value);
              onChange(e.target.value);
            }}
            className="w-9 h-9 rounded-lg border-none cursor-pointer"
          />
        )}
      </button>
    </div>
  );
}
'use client';

import type { WebsiteProject, GlobalPalette } from '@shared/types';

interface EditorSidebarProps {
  project: WebsiteProject;
  isDirty: boolean;
  isSaving: boolean;
  onColorChange: (key: keyof GlobalPalette, hex: string) => void;
  onSave: () => void;
  onToggleBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
}

const COLOR_LABELS: Record<keyof GlobalPalette, string> = {
  primary:    'Color principal',
  secondary:  'Color secundario',
  background: 'Fondo de página',
  text:       'Color de texto',
};

export function EditorSidebar({ project, isDirty, isSaving, onColorChange, onSave, onToggleBlock, onDeleteBlock }: EditorSidebarProps) {
  const sortedBlocks = [...project.blocks].sort((a, b) => a.order - b.order);

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      {/* Header del sidebar */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="font-bold text-slate-900 text-base">Editor de sitio</h2>
        <p className="text-xs text-slate-500 mt-0.5">{project.businessName}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Paleta de colores global */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Colores globales
          </h3>
          <div className="space-y-3">
            {(Object.keys(project.globalPalette) as Array<keyof GlobalPalette>).map(key => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-slate-700">{COLOR_LABELS[key]}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.globalPalette[key]}
                    onChange={e => onColorChange(key, e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    title={`Cambiar ${COLOR_LABELS[key]}`}
                  />
                  <span className="text-xs font-mono text-slate-400 w-16">
                    {project.globalPalette[key]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Panel de bloques — visibilidad */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Secciones del sitio
          </h3>
          <div className="space-y-2">
            {sortedBlocks.map(block => (
              <div key={block.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs cursor-grab">⠿</span>
                  <span className="text-sm font-medium text-slate-700 capitalize">{block.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleBlock(block.id)}
                    title={block.isVisible ? 'Ocultar' : 'Mostrar'}
                    className="p-1.5 hover:bg-slate-200 rounded text-sm"
                  >
                    {block.isVisible ? '👁️' : '🙈'}
                  </button>
                  <button
                    onClick={() => onDeleteBlock(block.id)}
                    className="p-1.5 hover:bg-red-50 text-red-400 rounded text-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer del sidebar — botón de guardado */}
      <div className="p-5 border-t border-slate-100">
        <button
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm
                     disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isSaving ? '💾 Guardando...' : isDirty ? '💾 Guardar cambios' : '✓ Todo guardado'}
        </button>
      </div>
    </aside>
  );
}

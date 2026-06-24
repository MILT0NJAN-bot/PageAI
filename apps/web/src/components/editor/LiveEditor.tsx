'use client';

import { useEffect, useCallback } from 'react';
import { useEditorState } from '@/hooks/useEditorState';
import { BlockRenderer } from './BlockRenderer';
import { EditorSidebar } from './EditorSidebar';
import type { WebsiteProject } from '@shared/types';

interface LiveEditorProps {
  initialProject: WebsiteProject;
}

export function LiveEditor({ initialProject }: LiveEditorProps) {
  const { state, loadProject, updateBlock, reorderBlocks, toggleBlock, deleteBlock, updateGlobalColor, saveProject } = useEditorState();

  useEffect(() => { loadProject(initialProject); }, [initialProject, loadProject]);

  // Auto-save cada 3 segundos si hay cambios
  useEffect(() => {
    if (!state.isDirty) return;
    const timer = setTimeout(saveProject, 3000);
    return () => clearTimeout(timer);
  }, [state.isDirty, saveProject]);

  if (!state.project) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  const sortedBlocks = [...state.project.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar izquierdo — controles globales */}
      <EditorSidebar
        project={state.project}
        isDirty={state.isDirty}
        isSaving={state.isSaving}
        onColorChange={updateGlobalColor}
        onSave={saveProject}
        onToggleBlock={toggleBlock}
        onDeleteBlock={deleteBlock}
      />

      {/* Canvas principal del editor */}
      <main className="flex-1 overflow-y-auto editor-canvas">
        {/* Barra de herramientas superior */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900">{state.project.businessName}</span>
            {state.isDirty && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                ● Sin guardar
              </span>
            )}
            {state.isSaving && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Guardando...
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Guardar
            </button>
            <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
              Publicar →
            </button>
          </div>
        </div>

        {/* Bloques renderizados en orden */}
        <div className="max-w-5xl mx-auto my-8 rounded-2xl overflow-hidden shadow-2xl bg-white">
          {sortedBlocks.filter(b => b.isVisible).map((block, index) => (
            <BlockRenderer
              key={block.id}
              block={block}
              index={index}
              totalBlocks={sortedBlocks.length}
              isEditable
              onUpdate={(field, value) => updateBlock(block.id, field, value)}
              onMoveUp={() => reorderBlocks(index, index - 1)}
              onMoveDown={() => reorderBlocks(index, index + 1)}
              onToggle={() => toggleBlock(block.id)}
              onDelete={() => deleteBlock(block.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

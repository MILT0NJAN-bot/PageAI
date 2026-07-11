'use client';

import { useEffect, useState } from 'react';
import { useEditorState } from '@/hooks/useEditorState';
import { BlockRenderer } from './BlockRenderer';
import { EditorSidebar } from './EditorSidebar';
import { ExportButton } from './ExportButton';
import { GeneratedLogo } from '@/components/branding/GeneratedLogo';
import type { WebsiteProject } from '@shared/types';

interface LiveEditorProps {
  initialProject: WebsiteProject;
  logoUrl?: string;
  isAdmin?: boolean;
}

export function LiveEditor({ initialProject, logoUrl, isAdmin = false }: LiveEditorProps) {
  const {
    state,
    loadProject,
    updateBlock,
    reorderBlocks,
    toggleBlock,
    deleteBlock,
    updateGlobalColor,
    saveProject,
  } = useEditorState();

  const [resolvedLogoUrl, setResolvedLogoUrl] = useState<string | undefined>(logoUrl || initialProject.logoUrl);

  useEffect(() => {
    loadProject(initialProject);

    const persistLogo = (value: string) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      void fetch(`${apiUrl}/api/projects/${initialProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: value }),
      });
    };

    // Migra al proyecto los logos que versiones anteriores guardaban solo en el navegador.
    if (logoUrl && !initialProject.logoUrl) persistLogo(logoUrl);

    // Busca el logo guardado con la clave especifica del proyecto
    if (!logoUrl && !initialProject.logoUrl) {
      try {
        const savedLogo = sessionStorage.getItem('editor_logo_' + initialProject.id);
        if (savedLogo) {
          setResolvedLogoUrl(savedLogo);
          persistLogo(savedLogo);
        }
      } catch {
        // sessionStorage no disponible
      }
    }
  }, [initialProject, loadProject, logoUrl]);

  useEffect(() => {
    if (!state.isDirty) return;
    const timer = setTimeout(saveProject, 3000);
    return () => clearTimeout(timer);
  }, [state.isDirty, saveProject]);

  if (!state.project) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="text-slate-400 text-sm">Cargando editor...</p>
      </div>
    </div>
  );

  const sortedBlocks = [...state.project.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <EditorSidebar
        project={state.project}
        isDirty={state.isDirty}
        isSaving={state.isSaving}
        onColorChange={updateGlobalColor}
        onSave={saveProject}
        onToggleBlock={toggleBlock}
        onDeleteBlock={deleteBlock}
      />

      <main className="flex-1 overflow-y-auto editor-canvas">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {resolvedLogoUrl ? (
              <img src={resolvedLogoUrl} alt="Logo" className="h-8 w-auto object-contain rounded" />
            ) : (
              <GeneratedLogo businessName={state.project.businessName} sector={state.project.sector} primaryColor={state.project.globalPalette.primary} compact />
            )}
            <span className="font-semibold text-slate-900">{state.project.businessName}</span>
            {state.isDirty && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                Sin guardar
              </span>
            )}
            {state.isSaving && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Guardando...
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <ExportButton projectId={state.project.id} businessName={state.project.businessName} logoUrl={resolvedLogoUrl} />
            )}
            <button
              onClick={saveProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto my-8 rounded-2xl overflow-hidden shadow-2xl bg-white">
          <div className="flex items-center justify-center py-8 px-8" style={{ backgroundColor: state.project.globalPalette.background }}>
            {resolvedLogoUrl ? (
              <img
                src={resolvedLogoUrl}
                alt={state.project.businessName}
                className="h-20 w-auto object-contain"
              />
            ) : (
              <GeneratedLogo businessName={state.project.businessName} sector={state.project.sector} primaryColor={state.project.globalPalette.primary} textColor={state.project.globalPalette.text} />
            )}
          </div>
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

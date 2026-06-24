// hooks/useEditorState.ts
// Motor de estado global del editor — useReducer con acciones tipadas.
// Patrón: los componentes despachan acciones, nunca mutan el estado directamente.

'use client';

import { useReducer, useCallback, useEffect } from 'react';
import type { Block, WebsiteProject, GlobalPalette } from '@shared/types';

// ── Tipos de acciones ──────────────────────────────────────────

type EditorAction =
  | { type: 'LOAD_PROJECT';        payload: WebsiteProject }
  | { type: 'UPDATE_BLOCK_DATA';   payload: { blockId: string; field: string; value: any } }
  | { type: 'REORDER_BLOCKS';      payload: { fromIndex: number; toIndex: number } }
  | { type: 'TOGGLE_BLOCK';        payload: { blockId: string } }
  | { type: 'DELETE_BLOCK';        payload: { blockId: string } }
  | { type: 'UPDATE_GLOBAL_COLOR'; payload: { colorKey: keyof GlobalPalette; hexValue: string } }
  | { type: 'SET_SAVING';          payload: boolean };

interface EditorState {
  project: WebsiteProject | null;
  isDirty: boolean;   // Hay cambios sin guardar
  isSaving: boolean;
  history: WebsiteProject[];      // Para undo/redo (futuro)
  historyIndex: number;
}

const initialState: EditorState = {
  project: null,
  isDirty: false,
  isSaving: false,
  history: [],
  historyIndex: -1,
};

// ── Mapa de colores globales → campos de bloques ───────────────
// Define qué campo de los bloques se actualiza cuando cambia cada color global.
const COLOR_TO_BLOCK_FIELD: Partial<Record<keyof GlobalPalette, string>> = {
  primary:    'accentColor',
  background: 'backgroundColor',
  text:       'textColor',
};

// ── Reducer puro — sin side effects ───────────────────────────

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {

    case 'LOAD_PROJECT':
      return {
        ...state,
        project: action.payload,
        isDirty: false,
        history: [action.payload],
        historyIndex: 0,
      };

    case 'UPDATE_BLOCK_DATA': {
      if (!state.project) return state;
      const { blockId, field, value } = action.payload;

      const newBlocks = state.project.blocks.map(b =>
        b.id === blockId
          ? { ...b, data: { ...b.data, [field]: value } }
          : b
      ) as Block[];

      const updated = { ...state.project, blocks: newBlocks };
      return { ...state, isDirty: true, project: updated };
    }

    case 'REORDER_BLOCKS': {
      if (!state.project) return state;
      const { fromIndex, toIndex } = action.payload;

      // Guarda de límites
      if (toIndex < 0 || toIndex >= state.project.blocks.length) return state;

      const sorted = [...state.project.blocks].sort((a, b) => a.order - b.order);
      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, moved);
      const reordered = sorted.map((b, i) => ({ ...b, order: i })) as Block[];

      return { ...state, isDirty: true, project: { ...state.project, blocks: reordered } };
    }

    case 'TOGGLE_BLOCK': {
      if (!state.project) return state;
      const newBlocks = state.project.blocks.map(b =>
        b.id === action.payload.blockId ? { ...b, isVisible: !b.isVisible } : b
      ) as Block[];
      return { ...state, isDirty: true, project: { ...state.project, blocks: newBlocks } };
    }

    case 'DELETE_BLOCK': {
      if (!state.project) return state;
      const newBlocks = state.project.blocks
        .filter(b => b.id !== action.payload.blockId)
        .map((b, i) => ({ ...b, order: i })) as Block[];
      return { ...state, isDirty: true, project: { ...state.project, blocks: newBlocks } };
    }

    case 'UPDATE_GLOBAL_COLOR': {
      if (!state.project) return state;
      const { colorKey, hexValue } = action.payload;

      // Actualiza la paleta global
      const newPalette = { ...state.project.globalPalette, [colorKey]: hexValue };

      // Propaga el cambio a todos los bloques según el mapa
      const blockField = COLOR_TO_BLOCK_FIELD[colorKey];
      const newBlocks = (blockField
        ? state.project.blocks.map(b => ({
            ...b,
            data: { ...b.data, [blockField]: hexValue },
          }))
        : state.project.blocks) as Block[];

      // Aplica las variables CSS en el DOM para reflejar cambios al instante
      if (typeof document !== 'undefined') {
        const cssVarMap: Record<string, string> = {
          primary: '--color-primary',
          secondary: '--color-secondary',
          background: '--color-background',
          text: '--color-text',
        };
        if (cssVarMap[colorKey]) {
          document.documentElement.style.setProperty(cssVarMap[colorKey], hexValue);
        }
      }

      return {
        ...state,
        isDirty: true,
        project: { ...state.project, globalPalette: newPalette, blocks: newBlocks },
      };
    }

    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };

    default:
      return state;
  }
}

// ── Hook público — API limpia para los componentes ─────────────

export function useEditorState() {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const loadProject = useCallback((project: WebsiteProject) => {
    dispatch({ type: 'LOAD_PROJECT', payload: project });
  }, []);

  const updateBlock = useCallback((blockId: string, field: string, value: any) => {
    dispatch({ type: 'UPDATE_BLOCK_DATA', payload: { blockId, field, value } });
  }, []);

  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_BLOCKS', payload: { fromIndex, toIndex } });
  }, []);

  const toggleBlock = useCallback((blockId: string) => {
    dispatch({ type: 'TOGGLE_BLOCK', payload: { blockId } });
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: { blockId } });
  }, []);

  const updateGlobalColor = useCallback((colorKey: keyof GlobalPalette, hexValue: string) => {
    dispatch({ type: 'UPDATE_GLOBAL_COLOR', payload: { colorKey, hexValue } });
  }, []);

  // Auto-save: guarda automáticamente 2 segundos después del último cambio
  const saveProject = useCallback(async () => {
    if (!state.project || !state.isDirty) return;
    dispatch({ type: 'SET_SAVING', payload: true });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/api/projects/${state.project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.project),
      });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.project, state.isDirty]);

  // Sincroniza variables CSS con la paleta al cargar el proyecto
  useEffect(() => {
    if (!state.project) return;
    const { primary, secondary, background, text } = state.project.globalPalette;
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-secondary', secondary);
    document.documentElement.style.setProperty('--color-background', background);
    document.documentElement.style.setProperty('--color-text', text);
  }, [state.project?.id]); // Solo al cargar, no en cada cambio (el reducer lo hace)

  return {
    state,
    loadProject,
    updateBlock,
    reorderBlocks,
    toggleBlock,
    deleteBlock,
    updateGlobalColor,
    saveProject,
  };
}

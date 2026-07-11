'use client';

import { useReducer, useCallback, useEffect } from 'react';
import type { Block, WebsiteProject, GlobalPalette } from '@shared/types';

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
  isDirty: boolean;
  isSaving: boolean;
}

const initialState: EditorState = {
  project: null,
  isDirty: false,
  isSaving: false,
};

// Mapa de colores globales → campos de bloques que se actualizan en cascada
const COLOR_TO_BLOCK_FIELD: Partial<Record<keyof GlobalPalette, string>> = {
  primary:    'accentColor',
  background: 'backgroundColor',
  text:       'textColor',
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {

    case 'LOAD_PROJECT':
      return { ...state, project: action.payload, isDirty: false };

    case 'UPDATE_BLOCK_DATA': {
      if (!state.project) return state;
      const { blockId, field, value } = action.payload;
      const newBlocks = state.project.blocks.map(b =>
        b.id === blockId
          ? { ...b, data: { ...b.data, [field]: value } }
          : b
      ) as Block[];
      return { ...state, isDirty: true, project: { ...state.project, blocks: newBlocks } };
    }

    case 'REORDER_BLOCKS': {
      if (!state.project) return state;
      const { fromIndex, toIndex } = action.payload;
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

      // 1. Actualiza la paleta global
      const newPalette = { ...state.project.globalPalette, [colorKey]: hexValue };

      // 2. Propaga el color a TODOS los bloques en cascada — así el cliente ve el cambio al instante
      const blockField = COLOR_TO_BLOCK_FIELD[colorKey];
      const newBlocks = (blockField
        ? state.project.blocks.map(b => ({
            ...b,
            data: { ...b.data, [blockField]: hexValue },
          }))
        : state.project.blocks) as Block[];

      // 3. Actualiza también las variables CSS del DOM para que Tailwind las refleje
      if (typeof document !== 'undefined') {
        const cssVarMap: Record<string, string> = {
          primary:    '--color-primary',
          secondary:  '--color-secondary',
          background: '--color-background',
          text:       '--color-text',
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

  // Sincroniza CSS vars al cargar el proyecto
  useEffect(() => {
    if (!state.project) return;
    const { primary, secondary, background, text } = state.project.globalPalette;
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-secondary', secondary);
    document.documentElement.style.setProperty('--color-background', background);
    document.documentElement.style.setProperty('--color-text', text);
  }, [state.project?.id]);

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
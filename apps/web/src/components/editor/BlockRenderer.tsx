'use client';

import { useState } from 'react';
import type { Block } from '@shared/types';
import { HeroBlock }     from '@/components/blocks/HeroBlock';
import { ServicesBlock } from '@/components/blocks/ServicesBlock';
import { GalleryBlock }  from '@/components/blocks/GalleryBlock';
import { ContactBlock }  from '@/components/blocks/ContactBlock';

// Registry de bloques — añadir aquí nuevos tipos sin tocar el editor
const BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  hero:     HeroBlock,
  services: ServicesBlock,
  gallery:  GalleryBlock,
  contact:  ContactBlock,
};

interface BlockRendererProps {
  block: Block;
  index: number;
  totalBlocks: number;
  isEditable: boolean;
  onUpdate: (field: string, value: any) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export function BlockRenderer({ block, index, totalBlocks, isEditable, onUpdate, onMoveUp, onMoveDown, onDelete }: BlockRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const BlockComponent = BLOCK_REGISTRY[block.type];

  if (!BlockComponent) return (
    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-300 m-4 rounded-xl">
      Bloque desconocido: {block.type}
    </div>
  );

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overlay de controles — aparece en hover */}
      {isHovered && isEditable && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-slate-200 p-1">
          <span className="text-xs text-slate-400 px-2 font-mono uppercase">{block.type}</span>
          <div className="w-px h-4 bg-slate-200" />
          <button onClick={onMoveUp}    disabled={index === 0}              title="Subir"    className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30 text-sm">↑</button>
          <button onClick={onMoveDown}  disabled={index === totalBlocks - 1} title="Bajar"    className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-30 text-sm">↓</button>
          <button onClick={onDelete}    title="Eliminar" className="p-1.5 hover:bg-red-50 text-red-500 rounded text-sm">🗑</button>
        </div>
      )}

      {/* Indicador visual de que el bloque es editable */}
      {isHovered && isEditable && (
        <div className="absolute inset-0 ring-2 ring-blue-400 ring-inset rounded pointer-events-none z-10" />
      )}

      <BlockComponent
        data={block.data}
        isEditable={isEditable}
        onUpdate={onUpdate}
      />
    </div>
  );
}

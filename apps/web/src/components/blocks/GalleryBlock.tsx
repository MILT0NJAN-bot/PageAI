// components/blocks/GalleryBlock.tsx

import type { GalleryBlockData } from '@shared/types';
import Image from 'next/image';

interface GalleryBlockProps {
  data: GalleryBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof GalleryBlockData, value: any) => void;
}

export function GalleryBlock({ data, isEditable = false, onUpdate }: GalleryBlockProps) {
  const colsClass = { 2: 'grid-cols-2', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' }[data.columns];

  return (
    <section style={{ backgroundColor: data.backgroundColor, color: data.textColor }} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={e => isEditable && onUpdate?.('title', e.currentTarget.innerText)}
            style={{ color: data.textColor }}
            className="text-4xl font-bold mb-4"
          >
            {data.title}
          </h2>
          <p style={{ color: data.textColor, opacity: 0.7 }} className="text-lg">{data.subtitle}</p>
        </div>

        <div className={`grid ${colsClass} gap-4`}>
          {data.images.map(img => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end p-4 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

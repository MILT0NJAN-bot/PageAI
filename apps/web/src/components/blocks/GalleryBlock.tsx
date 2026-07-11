'use client';

import type { GalleryBlockData } from '@shared/types';

// Imágenes placeholder por sector — no cuestan tokens
const GALLERY_PLACEHOLDERS: Record<string, string[]> = {
  beauty: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
    'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
  ],
};

interface GalleryBlockProps {
  data: GalleryBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof GalleryBlockData, value: any) => void;
}

export function GalleryBlock({ data, isEditable = false, onUpdate }: GalleryBlockProps) {
  const cols = data.columns || 3;
  const colsClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  // Si no hay imágenes propias, usa placeholders según sector
  const sector = (data as any).sector || 'default';
  const placeholders = GALLERY_PLACEHOLDERS[sector] || GALLERY_PLACEHOLDERS.default;
  const images = data.images?.length > 0 ? data.images : placeholders.map((url, i) => ({
    id: `placeholder_${i}`,
    url,
    alt: `Imagen ${i + 1}`,
  }));

  return (
    <section style={{ backgroundColor: data.backgroundColor }} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div style={{ backgroundColor: data.accentColor }} className="w-12 h-1 rounded-full mx-auto mb-6" />
          <h2
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={e => isEditable && onUpdate?.('title', e.currentTarget.innerText)}
            style={{ color: data.textColor }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {data.title}
          </h2>
          <p style={{ color: data.textColor, opacity: 0.65 }} className="text-lg">
            {data.subtitle}
          </p>
        </div>

        <div className={`grid ${colsClass[cols]} gap-4`}>
          {images.map((img: any, index: number) => (
            <div
              key={img.id || index}
              className={`relative overflow-hidden rounded-2xl group shadow-md hover:shadow-xl transition-all duration-500
                ${index === 0 ? 'row-span-2' : ''}`}
            >
              <img
                src={img.url}
                alt={img.alt || `Imagen ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ minHeight: index === 0 ? '400px' : '200px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {img.caption && (
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
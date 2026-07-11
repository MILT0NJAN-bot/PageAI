'use client';

import type { ServicesBlockData, ServiceItem } from '@shared/types';

interface ServicesBlockProps {
  data: ServicesBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof ServicesBlockData, value: any) => void;
}

export function ServicesBlock({ data, isEditable = false, onUpdate }: ServicesBlockProps) {
  const updateItem = (index: number, field: keyof ServiceItem, value: string) => {
    if (!onUpdate) return;
    const newItems = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate('items', newItems);
  };

  const editableProps = (handler: React.FocusEventHandler<HTMLElement>) =>
    isEditable ? { contentEditable: true as const, suppressContentEditableWarning: true, onBlur: handler } : {};

  return (
    <section style={{ backgroundColor: data.backgroundColor }} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Línea decorativa */}
          <div style={{ backgroundColor: data.accentColor }} className="w-12 h-1 rounded-full mx-auto mb-6" />
          <h2
            {...editableProps(e => onUpdate?.('title', e.currentTarget.innerText))}
            style={{ color: data.textColor }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {data.title}
          </h2>
          <p
            {...editableProps(e => onUpdate?.('subtitle', e.currentTarget.innerText))}
            style={{ color: data.textColor, opacity: 0.65 }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
          >
            {data.subtitle}
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div className={`grid gap-8 ${
          data.layout === 'list'
            ? 'grid-cols-1 max-w-2xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {data.items.map((item, index) => (
            <div
              key={item.id}
              style={{
                backgroundColor: data.cardBackgroundColor,
                borderTop: `4px solid ${data.accentColor}`,
              }}
              className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Ícono con fondo */}
              <div
                style={{ backgroundColor: `${data.accentColor}18` }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform"
              >
                {item.icon}
              </div>

              <h3
                {...editableProps(e => updateItem(index, 'title', e.currentTarget.innerText))}
                style={{ color: data.textColor }}
                className="text-xl font-bold mb-3"
              >
                {item.title}
              </h3>

              <p
                {...editableProps(e => updateItem(index, 'description', e.currentTarget.innerText))}
                style={{ color: data.textColor, opacity: 0.7 }}
                className="text-sm leading-relaxed mb-4"
              >
                {item.description}
              </p>

              {item.price && (
                <div style={{ color: data.accentColor }} className="font-bold text-lg">
                  {item.price}
                </div>
              )}

              {/* Flecha decorativa */}
              <div style={{ color: data.accentColor }} className="mt-4 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver más →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
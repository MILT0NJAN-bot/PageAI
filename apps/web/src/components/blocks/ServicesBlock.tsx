// components/blocks/ServicesBlock.tsx
// Bloque de servicios en cuadrícula — 100% props-driven.

import type { ServicesBlockData, ServiceItem } from '@shared/types';

interface ServicesBlockProps {
  data: ServicesBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof ServicesBlockData, value: any) => void;
}

export function ServicesBlock({ data, isEditable = false, onUpdate }: ServicesBlockProps) {
  // Actualiza un campo de un ServiceItem por índice
  const updateItem = (index: number, field: keyof ServiceItem, value: string) => {
    if (!onUpdate) return;
    const newItems = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate('items', newItems);
  };

  const editableProps = (onBlurHandler: React.FocusEventHandler<HTMLElement>) =>
    isEditable ? { contentEditable: true as const, suppressContentEditableWarning: true, onBlur: onBlurHandler } : {};

  return (
    <section style={{ backgroundColor: data.backgroundColor, color: data.textColor }} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header de sección */}
        <div className="text-center mb-14">
          <h2
            {...editableProps(e => onUpdate?.('title', e.currentTarget.innerText))}
            style={{ color: data.textColor }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {data.title}
          </h2>
          <p
            {...editableProps(e => onUpdate?.('subtitle', e.currentTarget.innerText))}
            style={{ color: data.textColor, opacity: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mx-auto"
          >
            {data.subtitle}
          </p>
        </div>

        {/* Grid de tarjetas de servicio */}
        <div className={`grid gap-6 ${
          data.layout === 'list'
            ? 'grid-cols-1 max-w-2xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {data.items.map((item, index) => (
            <div
              key={item.id}
              style={{
                backgroundColor: data.cardBackgroundColor,
                borderColor: `${data.accentColor}30`,
              }}
              className="rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Ícono — viene de props */}
              <div
                style={{ backgroundColor: `${data.accentColor}18` }}
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-5"
              >
                {item.icon}
              </div>

              {/* Título del servicio — editable */}
              <h3
                {...editableProps(e => updateItem(index, 'title', e.currentTarget.innerText))}
                style={{ color: data.textColor }}
                className="text-xl font-semibold mb-3"
              >
                {item.title}
              </h3>

              {/* Descripción — editable */}
              <p
                {...editableProps(e => updateItem(index, 'description', e.currentTarget.innerText))}
                style={{ color: data.textColor, opacity: 0.7 }}
                className="text-sm leading-relaxed"
              >
                {item.description}
              </p>

              {/* Precio opcional */}
              {item.price && (
                <p style={{ color: data.accentColor }} className="mt-4 font-semibold text-sm">
                  {item.price}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// components/blocks/ContactBlock.tsx

import type { ContactBlockData } from '@shared/types';

interface ContactBlockProps {
  data: ContactBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof ContactBlockData, value: any) => void;
}

export function ContactBlock({ data, isEditable = false, onUpdate }: ContactBlockProps) {
  return (
    <section style={{ backgroundColor: data.backgroundColor, color: data.textColor }} className="py-20 px-6" id="contacto">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          contentEditable={isEditable}
          suppressContentEditableWarning
          onBlur={e => isEditable && onUpdate?.('title', e.currentTarget.innerText)}
          style={{ color: data.textColor }}
          className="text-4xl font-bold mb-4"
        >
          {data.title}
        </h2>
        <p style={{ color: data.textColor, opacity: 0.7 }} className="text-lg mb-10">{data.subtitle}</p>

        {/* Información de contacto */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          {data.showPhone && data.phone && (
            <a href={`tel:${data.phone}`}
               style={{ color: data.accentColor }}
               className="flex items-center gap-2 font-medium hover:opacity-80">
              📞 {data.phone}
            </a>
          )}
          {data.showEmail && data.email && (
            <a href={`mailto:${data.email}`}
               style={{ color: data.accentColor }}
               className="flex items-center gap-2 font-medium hover:opacity-80">
              ✉️ {data.email}
            </a>
          )}
          {data.showAddress && data.address && (
            <span className="flex items-center gap-2">📍 {data.address}</span>
          )}
        </div>

        {/* Formulario dinámico — campos definidos en props */}
        <form className="space-y-4 text-left" onSubmit={e => e.preventDefault()}>
          {data.formFields.includes('name') && (
            <input type="text" placeholder="Tu nombre" className="w-full px-4 py-3 rounded-xl border border-current/20 bg-transparent focus:outline-none focus:ring-2" style={{ '--tw-ring-color': data.accentColor } as any} />
          )}
          {data.formFields.includes('email') && (
            <input type="email" placeholder="Tu email" className="w-full px-4 py-3 rounded-xl border border-current/20 bg-transparent focus:outline-none" />
          )}
          {data.formFields.includes('phone') && (
            <input type="tel" placeholder="Tu teléfono" className="w-full px-4 py-3 rounded-xl border border-current/20 bg-transparent focus:outline-none" />
          )}
          {data.formFields.includes('date') && (
            <input type="date" className="w-full px-4 py-3 rounded-xl border border-current/20 bg-transparent focus:outline-none" />
          )}
          {data.formFields.includes('message') && (
            <textarea rows={4} placeholder="Tu mensaje..." className="w-full px-4 py-3 rounded-xl border border-current/20 bg-transparent focus:outline-none resize-none" />
          )}
          <button
            type="submit"
            style={{ backgroundColor: data.buttonColor || data.accentColor, color: '#FFFFFF' }}
            className="w-full py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            {data.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}

'use client';

import type { ContactBlockData } from '@shared/types';

interface ContactBlockProps {
  data: ContactBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof ContactBlockData, value: any) => void;
}

// Imágenes decorativas por sector para la sección de contacto
const CONTACT_IMAGES: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80',
};

export function ContactBlock({ data, isEditable = false, onUpdate }: ContactBlockProps) {
  return (
    <section style={{ backgroundColor: data.backgroundColor }} className="py-24 px-6" id="contacto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Columna izquierda — info */}
          <div>
            <div style={{ backgroundColor: data.accentColor }} className="w-12 h-1 rounded-full mb-6" />
            <h2
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={e => isEditable && onUpdate?.('title', e.currentTarget.innerText)}
              style={{ color: data.textColor }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {data.title}
            </h2>
            <p
              style={{ color: data.textColor, opacity: 0.7 }}
              className="text-lg mb-8 leading-relaxed"
            >
              {data.subtitle}
            </p>

            {/* Datos de contacto */}
            <div className="space-y-4">
              {data.showPhone && data.phone && (
                <a href={`tel:${data.phone}`}
                   style={{ color: data.accentColor }}
                   className="flex items-center gap-3 font-medium hover:opacity-80 transition-opacity">
                  <span style={{ backgroundColor: `${data.accentColor}18` }} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg">📞</span>
                  {data.phone}
                </a>
              )}
              {data.showEmail && data.email && (
                <a href={`mailto:${data.email}`}
                   style={{ color: data.accentColor }}
                   className="flex items-center gap-3 font-medium hover:opacity-80 transition-opacity">
                  <span style={{ backgroundColor: `${data.accentColor}18` }} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg">✉️</span>
                  {data.email}
                </a>
              )}
              {data.showAddress && data.address && (
                <div style={{ color: data.textColor }} className="flex items-center gap-3">
                  <span style={{ backgroundColor: `${data.accentColor}18` }} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg">📍</span>
                  {data.address}
                </div>
              )}
            </div>

            {/* Imagen decorativa */}
            <div className="mt-10 rounded-2xl overflow-hidden shadow-xl hidden lg:block">
              <img
                src={CONTACT_IMAGES.default}
                alt="Contacto"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Columna derecha — formulario */}
          <div
            style={{ backgroundColor: data.cardBackgroundColor || '#ffffff' }}
            className="rounded-3xl p-8 shadow-2xl border border-slate-100"
          >
            <h3 style={{ color: data.textColor }} className="text-xl font-bold mb-6">
              Envíanos un mensaje
            </h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              {data.formFields.includes('name') && (
                <div>
                  <label style={{ color: data.textColor }} className="text-sm font-medium mb-1.5 block opacity-70">Nombre</label>
                  <input type="text" placeholder="Tu nombre completo"
                    style={{ borderColor: `${data.accentColor}30`, color: data.textColor }}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:border-current transition-colors" />
                </div>
              )}
              {data.formFields.includes('email') && (
                <div>
                  <label style={{ color: data.textColor }} className="text-sm font-medium mb-1.5 block opacity-70">Email</label>
                  <input type="email" placeholder="tu@email.com"
                    style={{ borderColor: `${data.accentColor}30`, color: data.textColor }}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:border-current transition-colors" />
                </div>
              )}
              {data.formFields.includes('phone') && (
                <div>
                  <label style={{ color: data.textColor }} className="text-sm font-medium mb-1.5 block opacity-70">Teléfono</label>
                  <input type="tel" placeholder="Tu teléfono"
                    style={{ borderColor: `${data.accentColor}30`, color: data.textColor }}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:border-current transition-colors" />
                </div>
              )}
              {data.formFields.includes('date') && (
                <div>
                  <label style={{ color: data.textColor }} className="text-sm font-medium mb-1.5 block opacity-70">Fecha preferida</label>
                  <input type="date"
                    style={{ borderColor: `${data.accentColor}30`, color: data.textColor }}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:border-current transition-colors" />
                </div>
              )}
              {data.formFields.includes('message') && (
                <div>
                  <label style={{ color: data.textColor }} className="text-sm font-medium mb-1.5 block opacity-70">Mensaje</label>
                  <textarea rows={4} placeholder="¿En qué podemos ayudarte?"
                    style={{ borderColor: `${data.accentColor}30`, color: data.textColor }}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-transparent focus:outline-none focus:border-current transition-colors resize-none" />
                </div>
              )}
              <button
                type="submit"
                style={{ backgroundColor: data.buttonColor || data.accentColor, color: '#FFFFFF' }}
                className="w-full py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg mt-2"
              >
                {data.buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
// components/blocks/HeroBlock.tsx
// Bloque Hero — completamente driven por props.
// Sin ningún texto, color o imagen hardcodeada.

import type { HeroBlockData } from '@shared/types';

interface HeroBlockProps {
  data: HeroBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof HeroBlockData, value: string) => void;
}

export function HeroBlock({ data, isEditable = false, onUpdate }: HeroBlockProps) {
  // Todos los colores y la imagen vienen de props — nunca de clases estáticas
  const sectionStyle: React.CSSProperties = {
    backgroundColor: data.backgroundColor,
    color: data.textColor,
    backgroundImage: data.backgroundImage
      ? `linear-gradient(rgba(0,0,0,${data.overlayOpacity ?? 0.4}), rgba(0,0,0,${data.overlayOpacity ?? 0.4})), url(${data.backgroundImage})`
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  // Handler genérico para edición inline — solo activo en modo editor
  const onBlur = (field: keyof HeroBlockData) =>
    (e: React.FocusEvent<HTMLElement>) => {
      if (isEditable && onUpdate) {
        onUpdate(field, e.currentTarget.innerText.trim());
      }
    };

  const editableProps = (field: keyof HeroBlockData) =>
    isEditable
      ? { contentEditable: true as const, suppressContentEditableWarning: true, onBlur: onBlur(field) }
      : {};

  return (
    <section style={sectionStyle} className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      {/* Badge opcional — sector o tagline */}
      <div style={{ backgroundColor: `${data.accentColor}25`, color: data.accentColor }}
        className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-current/20">
        ✨ Bienvenido
      </div>

      {/* Headline principal — editable inline */}
      <h1
        {...editableProps('headline')}
        style={{ color: data.textColor }}
        className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl"
      >
        {data.headline}
      </h1>

      {/* Subheadline — editable inline */}
      <p
        {...editableProps('subheadline')}
        style={{ color: data.textColor, opacity: 0.85 }}
        className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed"
      >
        {data.subheadline}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* CTA Principal — accentColor como fondo */}
        <a
          href={data.ctaUrl}
          style={{ backgroundColor: data.accentColor, color: '#FFFFFF' }}
          className="px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
          onClick={e => isEditable && e.preventDefault()}
        >
          <span {...editableProps('ctaText')}>{data.ctaText}</span>
        </a>

        {/* CTA Secundario — opcional */}
        {data.secondaryCtaText && (
          <a
            href={data.secondaryCtaUrl || '#'}
            style={{ color: data.textColor, borderColor: `${data.textColor}50` }}
            className="px-10 py-4 rounded-full text-lg font-semibold border-2 hover:opacity-80 transition-opacity"
            onClick={e => isEditable && e.preventDefault()}
          >
            {data.secondaryCtaText}
          </a>
        )}
      </div>
    </section>
  );
}

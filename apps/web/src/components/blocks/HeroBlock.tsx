'use client';
import React from 'react';
import type { HeroBlockData } from '@shared/types';
interface HeroBlockProps {
  data: HeroBlockData;
  isEditable?: boolean;
  onUpdate?: (field: keyof HeroBlockData, value: string) => void;
}
const SECTOR_IMAGES: Record<string, string> = {
  beauty: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80',
  fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
  professional: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
  education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80',
};
function isLightColor(hex: string): boolean {
  try {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return (0.299*r + 0.587*g + 0.114*b)/255 > 0.5;
  } catch { return false; }
}
export function HeroBlock({ data, isEditable = false, onUpdate }: HeroBlockProps) {
  const bgImage = data.backgroundImage || SECTOR_IMAGES[(data as any).sector || ''] || '';
  const hasImage = !!bgImage;
  const bgIsLight = !hasImage && isLightColor(data.backgroundColor);
  const safeTextColor = hasImage ? '#FFFFFF' : bgIsLight ? '#1A1A1A' : '#FFFFFF';
  const overlayOpacity = hasImage ? (data.overlayOpacity ?? 0.55) : 0;
  const sectionStyle: React.CSSProperties = {
    backgroundColor: data.backgroundColor,
    color: safeTextColor,
    backgroundImage: hasImage ? 'linear-gradient(rgba(0,0,0,' + overlayOpacity + '), rgba(0,0,0,' + overlayOpacity + ')), url(' + bgImage + ')' : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };
  const onBlur = (field: keyof HeroBlockData) => (e: React.FocusEvent<HTMLElement>) => {
    if (isEditable && onUpdate) onUpdate(field, e.currentTarget.innerText.trim());
  };
  const editableProps = (field: keyof HeroBlockData) =>
    isEditable ? { contentEditable: true as const, suppressContentEditableWarning: true, onBlur: onBlur(field) } : {};
  const badgeStyle: React.CSSProperties = {
    backgroundColor: data.accentColor + '30',
    color: hasImage ? '#ffffff' : (bgIsLight ? data.accentColor : '#ffffff'),
    borderColor: data.accentColor + '50',
  };
  return (
    <section style={sectionStyle} className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div style={badgeStyle} className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 border">
        Bienvenido
      </div>
      <h1 {...editableProps('headline')} style={{ color: safeTextColor, textShadow: hasImage ? '0 2px 20px rgba(0,0,0,0.5)' : 'none' }} className="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-4xl">
        {data.headline}
      </h1>
      <p {...editableProps('subheadline')} style={{ color: safeTextColor, opacity: 0.85 }} className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed">
        {data.subheadline}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <a href={data.ctaUrl} style={{ backgroundColor: data.accentColor, color: '#FFFFFF' }} className="px-10 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-all hover:scale-105 shadow-xl" onClick={e => isEditable && e.preventDefault()}>
          <span {...editableProps('ctaText')}>{data.ctaText}</span>
        </a>
        {data.secondaryCtaText && (
          <a href={data.secondaryCtaUrl || '#'} style={{ color: safeTextColor, borderColor: safeTextColor + '60', backgroundColor: 'transparent' }} className="px-10 py-4 rounded-full text-lg font-semibold border-2 hover:opacity-80 transition-all" onClick={e => isEditable && e.preventDefault()}>
            {data.secondaryCtaText}
          </a>
        )}
      </div>
    </section>
  );
}
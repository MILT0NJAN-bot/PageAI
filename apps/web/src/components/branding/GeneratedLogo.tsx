import type { Sector } from '@shared/types';

interface GeneratedLogoProps {
  businessName: string;
  sector: Sector;
  primaryColor: string;
  textColor?: string;
  compact?: boolean;
}

const SECTOR_SYMBOLS: Record<Sector, string> = {
  beauty: '✂', restaurant: '✹', fitness: '⚡', retail: '◆', professional: '▣', education: '✎',
};

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(word => word[0]?.toUpperCase()).join('');
}

export function GeneratedLogo({ businessName, sector, primaryColor, textColor = '#0f172a', compact = false }: GeneratedLogoProps) {
  return (
    <div className="inline-flex items-center gap-3" aria-label={`Logo de ${businessName}`}>
      <div
        className={`${compact ? 'h-9 w-9 text-xs' : 'h-16 w-16 text-lg'} relative shrink-0 rounded-2xl flex items-center justify-center font-black text-white shadow-lg`}
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}bb)`, boxShadow: `0 10px 30px ${primaryColor}45` }}
      >
        <span>{getInitials(businessName)}</span>
        <span className={`${compact ? '-right-1 -bottom-1 h-4 w-4 text-[8px]' : '-right-2 -bottom-2 h-7 w-7 text-sm'} absolute rounded-full bg-white flex items-center justify-center shadow-md`} style={{ color: primaryColor }} aria-hidden="true">
          {SECTOR_SYMBOLS[sector]}
        </span>
      </div>
      {!compact && (
        <div className="text-left leading-none">
          <div className="text-xl md:text-2xl font-black tracking-tight" style={{ color: textColor }}>{businessName}</div>
          <div className="mt-2 h-1 w-12 rounded-full" style={{ backgroundColor: primaryColor }} />
        </div>
      )}
    </div>
  );
}

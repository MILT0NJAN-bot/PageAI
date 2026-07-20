'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Block, WebsiteProject } from '@shared/types';
import { HeroBlock } from '@/components/blocks/HeroBlock';
import { ServicesBlock } from '@/components/blocks/ServicesBlock';
import { GalleryBlock } from '@/components/blocks/GalleryBlock';
import { ContactBlock } from '@/components/blocks/ContactBlock';
import { CustomFeatureBlock } from '@/components/blocks/CustomFeatureBlock';
import { GeneratedLogo } from '@/components/branding/GeneratedLogo';
import { TestimonialsBlock } from '@/components/blocks/TestimonialsBlock';
import { PricingBlock } from '@/components/blocks/PricingBlock';

interface Props { project: WebsiteProject; canEdit?: boolean; }

const SECTION_LABELS: Partial<Record<Block['type'], string>> = {
  hero: 'Inicio', services: 'Servicios', gallery: 'Galería', pricing: 'Precios', testimonials: 'Opiniones', custom_feature: 'Área de clientes', contact: 'Contacto',
};

function renderBlock(block: Block) {
  switch (block.type) {
    case 'hero': return <HeroBlock data={block.data} />;
    case 'services': return <ServicesBlock data={block.data} />;
    case 'gallery': return <GalleryBlock data={block.data} />;
    case 'contact': return <ContactBlock data={block.data} />;
    case 'custom_feature': return <CustomFeatureBlock data={block.data} />;
    case 'testimonials': return <TestimonialsBlock data={block.data} />;
    case 'pricing': return <PricingBlock data={block.data} />;
    default: return null;
  }
}

export function PublicSite({ project, canEdit = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteRequested, setQuoteRequested] = useState(project.status === 'QUOTE_REQUESTED');
  const blocks = [...project.blocks].filter(block => block.isVisible).sort((a, b) => a.order - b.order);
  const navigation = blocks.filter(block => SECTION_LABELS[block.type]);
  const hasContact = blocks.some(block => block.type === 'contact');
  const expired = Boolean(project.demoExpiresAt && new Date(project.demoExpiresAt) < new Date());
  async function requestQuote(){const api=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001';const response=await fetch(`${api}/api/projects/${project.id}/request-quote`,{method:'POST',credentials:'include',headers:{'x-project-token':project.accessToken||''}});if(response.ok)setQuoteRequested(true)}

  return (
    <div className="min-h-screen" style={{ backgroundColor: project.globalPalette.background, color: project.globalPalette.text }}>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
          <a href="#inicio" className="shrink-0">
            {project.logoUrl ? <img src={project.logoUrl} alt={project.businessName} className="h-11 max-w-[180px] object-contain" /> : <span className="flex items-center gap-3"><GeneratedLogo businessName={project.businessName} sector={project.sector} primaryColor={project.globalPalette.primary} compact /><span className="font-black text-slate-900">{project.businessName}</span></span>}
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            {navigation.map(block => <a key={block.id} href={`#${block.type === 'hero' ? 'inicio' : block.type}`} className="hover:opacity-60 transition-opacity">{SECTION_LABELS[block.type]}</a>)}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {blocks.some(block => block.type === 'custom_feature') && <a href="#custom_feature" className="px-4 py-2.5 rounded-xl border text-sm font-bold" style={{ borderColor: project.globalPalette.primary, color: project.globalPalette.primary }}>Iniciar sesión</a>}
            {hasContact && <a href="#contact" className="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg" style={{ backgroundColor: project.globalPalette.primary }}>Contactar</a>}
          </div>
          <button onClick={() => setMenuOpen(value => !value)} className="md:hidden w-10 h-10 rounded-xl bg-slate-100 text-slate-900 text-xl" aria-label="Abrir menú">{menuOpen ? '×' : '☰'}</button>
        </div>
        {menuOpen && <nav className="md:hidden px-5 pb-5 bg-white border-t border-slate-100 flex flex-col gap-1">{navigation.map(block => <a key={block.id} onClick={() => setMenuOpen(false)} href={`#${block.type === 'hero' ? 'inicio' : block.type}`} className="px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50">{SECTION_LABELS[block.type]}</a>)}{hasContact&&<a href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 px-4 py-3 rounded-xl text-center text-white font-bold" style={{ backgroundColor: project.globalPalette.primary }}>Contactar</a>}</nav>}
      </header>

      <main>
        {blocks.map(block => <div id={block.type === 'hero' ? 'inicio' : block.type} key={block.id} className="scroll-mt-20">{renderBlock(block)}</div>)}
      </main>

      <footer className="bg-slate-950 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div><p className="font-black text-lg">{project.businessName}</p><p className="text-slate-500 text-sm mt-1">Presencia digital creada para crecer.</p></div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} {project.businessName}. Todos los derechos reservados.</p>
        </div>
      </footer>

      <div className="fixed left-4 bottom-4 z-50 px-3 py-2 rounded-full bg-slate-950/90 text-white text-xs shadow-xl">Demo de Page AI {expired ? '• Vencida' : '• Editable por 15 días'}</div>
      <div className="fixed right-5 bottom-5 z-50 flex gap-2">
        {!expired&&<button onClick={requestQuote} disabled={quoteRequested} className="px-5 py-3 rounded-full bg-emerald-600 text-white text-sm font-bold shadow-2xl disabled:bg-emerald-800">{quoteRequested?'Cotización solicitada':'Solicitar cotización'}</button>}
        {canEdit&&!expired&&<Link href={`/editor/${project.id}${project.accessToken ? `?token=${encodeURIComponent(project.accessToken)}` : ''}`} className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-2xl transition-colors">Editar diseño</Link>}
      </div>
    </div>
  );
}

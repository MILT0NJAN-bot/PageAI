import type { Block, WebsiteProject, GlobalPalette } from '@shared/types';

function generateHeroHTML(data: any, logoUrl?: string): string {
  const bgImage = data.backgroundImage || '';
  const overlayOpacity = data.overlayOpacity ?? 0.5;

  const bgStyle = bgImage
    ? `background: linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url('${bgImage}') center/cover no-repeat fixed;`
    : `background-color: ${data.backgroundColor};`;

  const logoHTML = logoUrl
    ? `<img src="${logoUrl}" alt="Logo" style="height:70px; object-fit:contain; margin-bottom:28px; filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3));">`
    : '';

  return `
  <section style="${bgStyle} color:${bgImage ? '#ffffff' : data.textColor}; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 24px; text-align:center; position:relative; overflow:hidden;">
    <div style="position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%); pointer-events:none;"></div>
    <div style="position:relative; z-index:1; max-width:900px; width:100%;">
      ${logoHTML}
      <div style="display:inline-block; padding:8px 20px; background:${data.accentColor}40; color:${bgImage ? '#fff' : data.accentColor}; border-radius:999px; font-size:13px; font-weight:600; margin-bottom:24px; border:1px solid ${data.accentColor}60; letter-spacing:.05em; text-transform:uppercase;">
        ✨ Bienvenido
      </div>
      <h1 style="font-size:clamp(2.5rem,7vw,5rem); font-weight:900; margin:0 0 24px; line-height:1.1; text-shadow:0 2px 30px rgba(0,0,0,0.4); letter-spacing:-.02em;">
        ${data.headline}
      </h1>
      <p style="font-size:clamp(1.1rem,2.5vw,1.4rem); opacity:0.9; margin:0 0 40px; max-width:620px; margin-left:auto; margin-right:auto; line-height:1.8; text-shadow:0 1px 10px rgba(0,0,0,0.3);">
        ${data.subheadline}
      </p>
      <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
        <a href="${data.ctaUrl || '#contacto'}" style="display:inline-block; padding:18px 44px; background:${data.accentColor}; color:#fff; border-radius:999px; font-size:1.1rem; font-weight:700; text-decoration:none; box-shadow:0 8px 30px ${data.accentColor}60; transition:all .3s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 12px 40px ${data.accentColor}80'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 30px ${data.accentColor}60'">
          ${data.ctaText}
        </a>
        ${data.secondaryCtaText ? `
        <a href="${data.secondaryCtaUrl || '#'}" style="display:inline-block; padding:18px 44px; background:transparent; color:#fff; border-radius:999px; font-size:1.1rem; font-weight:600; text-decoration:none; border:2px solid rgba(255,255,255,0.6); transition:all .3s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='transparent'">
          ${data.secondaryCtaText}
        </a>` : ''}
      </div>
    </div>
    <div style="position:absolute; bottom:32px; left:50%; transform:translateX(-50%); animation:bounce 2s infinite;">
      <div style="width:30px; height:50px; border:2px solid rgba(255,255,255,0.4); border-radius:999px; display:flex; align-items:flex-start; justify-content:center; padding:6px;">
        <div style="width:4px; height:10px; background:rgba(255,255,255,0.7); border-radius:999px; animation:scroll 2s infinite;"></div>
      </div>
    </div>
  </section>`;
}

function generateServicesHTML(data: any): string {
  const itemsHTML = (data.items || []).map((item: any, i: number) => `
    <div style="background:${data.cardBackgroundColor}; border-radius:20px; padding:36px 28px; transition:all .3s; position:relative; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06);" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 20px 50px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'">
      <div style="position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, ${data.accentColor}, ${data.accentColor}80);"></div>
      <div style="width:64px; height:64px; background:linear-gradient(135deg, ${data.accentColor}20, ${data.accentColor}08); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:32px; margin-bottom:20px; border:1px solid ${data.accentColor}20;">
        ${item.icon}
      </div>
      <h3 style="font-size:1.25rem; font-weight:800; margin:0 0 12px; color:${data.textColor}; letter-spacing:-.01em;">
        ${item.title}
      </h3>
      <p style="font-size:.95rem; line-height:1.75; color:${data.textColor}; opacity:.7; margin:0 0 16px;">
        ${item.description}
      </p>
      ${item.price ? `<div style="display:inline-block; padding:6px 16px; background:${data.accentColor}15; color:${data.accentColor}; border-radius:999px; font-weight:700; font-size:.9rem;">${item.price}</div>` : ''}
    </div>`).join('');

  return `
  <section style="background:${data.backgroundColor}; padding:100px 24px; position:relative;">
    <div style="max-width:1200px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:70px;">
        <div style="display:inline-block; width:48px; height:4px; background:${data.accentColor}; border-radius:999px; margin-bottom:20px;"></div>
        <h2 style="font-size:clamp(2rem,4vw,3.2rem); font-weight:900; color:${data.textColor}; margin:0 0 16px; letter-spacing:-.02em;">
          ${data.title}
        </h2>
        <p style="font-size:1.15rem; color:${data.textColor}; opacity:.65; max-width:560px; margin:0 auto; line-height:1.7;">
          ${data.subtitle}
        </p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:28px;">
        ${itemsHTML}
      </div>
    </div>
  </section>`;
}

function generateGalleryHTML(data: any): string {
  const cols = data.columns || 3;
  const images = data.images?.length > 0 ? data.images : [];

  if (images.length === 0) return '';

  const imagesHTML = images.map((img: any, i: number) => `
    <div style="position:relative; overflow:hidden; border-radius:16px; ${i === 0 ? 'grid-row: span 2;' : ''} box-shadow:0 4px 20px rgba(0,0,0,0.1); cursor:pointer;" onmouseover="this.querySelector('img').style.transform='scale(1.08)';this.querySelector('.overlay').style.opacity='1'" onmouseout="this.querySelector('img').style.transform='scale(1)';this.querySelector('.overlay').style.opacity='0'">
      <img src="${img.url}" alt="${img.alt || ''}" style="width:100%; height:100%; object-fit:cover; transition:transform .6s ease; min-height:${i === 0 ? '400px' : '200px'};">
      <div class="overlay" style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.6), transparent); opacity:0; transition:opacity .3s; display:flex; align-items:flex-end; padding:20px;">
        ${img.caption ? `<p style="color:#fff; font-weight:600; font-size:.95rem; margin:0;">${img.caption}</p>` : ''}
      </div>
    </div>`).join('');

  return `
  <section style="background:${data.backgroundColor}; padding:100px 24px;">
    <div style="max-width:1200px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:60px;">
        <div style="display:inline-block; width:48px; height:4px; background:${data.accentColor}; border-radius:999px; margin-bottom:20px;"></div>
        <h2 style="font-size:clamp(2rem,4vw,3.2rem); font-weight:900; color:${data.textColor}; margin:0 0 16px;">${data.title}</h2>
        <p style="font-size:1.15rem; color:${data.textColor}; opacity:.65;">${data.subtitle}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(${cols},1fr); gap:16px; grid-auto-rows:200px;">
        ${imagesHTML}
      </div>
    </div>
  </section>`;
}

function generateContactHTML(data: any): string {
  const fieldsHTML = (data.formFields || ['name', 'email', 'message']).map((field: string) => {
    const base = `width:100%; padding:16px 18px; border:2px solid ${data.accentColor}25; border-radius:14px; font-size:1rem; font-family:inherit; background:rgba(255,255,255,0.8); color:${data.textColor}; box-sizing:border-box; margin-bottom:14px; outline:none; transition:border-color .2s;`;
    const focus = `onfocus="this.style.borderColor='${data.accentColor}'" onblur="this.style.borderColor='${data.accentColor}25'"`;
    if (field === 'message') return `<textarea placeholder="¿En qué podemos ayudarte?" rows="4" style="${base} resize:vertical;" ${focus}></textarea>`;
    if (field === 'date')    return `<input type="date" style="${base}" ${focus}>`;
    if (field === 'phone')   return `<input type="tel" placeholder="Tu teléfono" style="${base}" ${focus}>`;
    if (field === 'email')   return `<input type="email" placeholder="tu@email.com" style="${base}" ${focus}>`;
    return `<input type="text" placeholder="Tu nombre completo" style="${base}" ${focus}>`;
  }).join('');

  return `
  <section id="contacto" style="background:${data.backgroundColor}; padding:100px 24px;">
    <div style="max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;">
      <div>
        <div style="display:inline-block; width:48px; height:4px; background:${data.accentColor}; border-radius:999px; margin-bottom:20px;"></div>
        <h2 style="font-size:clamp(2rem,4vw,3rem); font-weight:900; color:${data.textColor}; margin:0 0 16px;">${data.title}</h2>
        <p style="font-size:1.1rem; color:${data.textColor}; opacity:.7; line-height:1.8; margin-bottom:32px;">${data.subtitle}</p>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${data.showPhone && data.phone ? `
          <a href="tel:${data.phone}" style="display:flex; align-items:center; gap:14px; text-decoration:none; color:${data.textColor}; font-weight:500; transition:color .2s;" onmouseover="this.style.color='${data.accentColor}'" onmouseout="this.style.color='${data.textColor}'">
            <div style="width:48px; height:48px; background:${data.accentColor}15; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">📞</div>
            <span>${data.phone}</span>
          </a>` : ''}
          ${data.showEmail && data.email ? `
          <a href="mailto:${data.email}" style="display:flex; align-items:center; gap:14px; text-decoration:none; color:${data.textColor}; font-weight:500; transition:color .2s;" onmouseover="this.style.color='${data.accentColor}'" onmouseout="this.style.color='${data.textColor}'">
            <div style="width:48px; height:48px; background:${data.accentColor}15; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">✉️</div>
            <span>${data.email}</span>
          </a>` : ''}
          ${data.showAddress && data.address ? `
          <div style="display:flex; align-items:center; gap:14px; color:${data.textColor}; font-weight:500;">
            <div style="width:48px; height:48px; background:${data.accentColor}15; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0;">📍</div>
            <span>${data.address}</span>
          </div>` : ''}
        </div>
      </div>
      <div style="background:white; border-radius:24px; padding:40px; box-shadow:0 20px 60px rgba(0,0,0,0.1);">
        <h3 style="font-size:1.3rem; font-weight:800; color:${data.textColor}; margin:0 0 24px;">Envíanos un mensaje</h3>
        <form onsubmit="handleFormSubmit(event)">
          ${fieldsHTML}
          <button type="submit" style="width:100%; padding:18px; background:${data.buttonColor || data.accentColor}; color:#fff; border:none; border-radius:14px; font-size:1.05rem; font-weight:700; cursor:pointer; font-family:inherit; transition:all .3s; box-shadow:0 6px 20px ${data.accentColor}40;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 10px 30px ${data.accentColor}60'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 6px 20px ${data.accentColor}40'">
            ${data.buttonText || 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </div>
  </section>`;
}

function generateTestimonialsHTML(data: any): string {
  const stars = (rating: number) => {
    const r = typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : 5;
    return '<span style="color:#FFB800;">★</span>'.repeat(r) + '<span style="opacity:.3;">★</span>'.repeat(5 - r);
  };

  const itemsHTML = (data.items || []).map((item: any) => {
    const text      = item.text      && item.text      !== 'undefined' ? item.text      : 'Excelente servicio, lo recomiendo ampliamente.';
    const role      = item.role      && item.role      !== 'undefined' ? item.role      : 'Cliente';
    const bgColor   = data.cardBackgroundColor && data.cardBackgroundColor !== 'undefined' ? data.cardBackgroundColor : '#ffffff';

    return `
    <div style="background:${bgColor}; border-radius:20px; padding:32px; box-shadow:0 4px 24px rgba(0,0,0,0.07); transition:all .3s; position:relative;" onmouseover="this.style.transform='translateY(-6px)';this.style.boxShadow='0 16px 40px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 24px rgba(0,0,0,0.07)'">
      <div style="position:absolute; top:24px; right:24px; font-size:3rem; color:${data.accentColor}; opacity:.15; font-family:Georgia, serif; line-height:1;">"</div>
      <div style="margin-bottom:16px;">${stars(item.rating)}</div>
      <p style="font-size:1rem; line-height:1.8; color:${data.textColor}; opacity:.85; margin:0 0 24px; font-style:italic;">
        "${text}"
      </p>
      <div style="display:flex; align-items:center; gap:14px; padding-top:20px; border-top:1px solid ${data.accentColor}15;">
        ${item.avatar
          ? `<img src="${item.avatar}" alt="${item.name}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid ${data.accentColor}30;">`
          : `<div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, ${data.accentColor}, ${data.accentColor}80); display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff; font-size:1.1rem; flex-shrink:0;">${(item.name || 'C')[0].toUpperCase()}</div>`}
        <div>
          <p style="font-weight:800; color:${data.textColor}; margin:0; font-size:.95rem;">${item.name || 'Cliente'}</p>
          <p style="color:${data.accentColor}; margin:0; font-size:.85rem; font-weight:500;">${role}</p>
        </div>
      </div>
    </div>`;
  }).join('');

  const subtitle = data.subtitle && data.subtitle !== 'undefined' ? data.subtitle : '';

  return `
  <section style="background:${data.backgroundColor}; padding:100px 24px;">
    <div style="max-width:1200px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:60px;">
        <div style="display:inline-block; width:48px; height:4px; background:${data.accentColor}; border-radius:999px; margin-bottom:20px;"></div>
        <h2 style="font-size:clamp(2rem,4vw,3.2rem); font-weight:900; color:${data.textColor}; margin:0 0 16px;">${data.title}</h2>
        ${subtitle ? `<p style="font-size:1.15rem; color:${data.textColor}; opacity:.65;">${subtitle}</p>` : ''}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:28px;">
        ${itemsHTML}
      </div>
    </div>
  </section>`;
}

function generatePricingHTML(data: any): string {
  const tiersHTML = (data.tiers || []).map((tier: any) => `
    <div style="background:${tier.isHighlighted ? data.accentColor : (data.cardBackgroundColor || '#ffffff')}; color:${tier.isHighlighted ? '#fff' : data.textColor}; border-radius:24px; padding:40px 32px; position:relative; box-shadow:${tier.isHighlighted ? `0 20px 60px ${data.accentColor}50` : '0 4px 20px rgba(0,0,0,0.07)'}; ${tier.isHighlighted ? 'transform:scale(1.05);' : ''}">
      ${tier.isHighlighted ? `<div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg,#FFD700,#FFA500); color:#333; padding:6px 20px; border-radius:999px; font-size:.8rem; font-weight:800; white-space:nowrap;">⭐ Más popular</div>` : ''}
      <h3 style="font-size:1.4rem; font-weight:800; margin:0 0 8px;">${tier.name}</h3>
      <div style="margin:0 0 8px;">
        <span style="font-size:3rem; font-weight:900;">${tier.price}</span>
        <span style="opacity:.7; font-size:.95rem;"> / ${tier.period}</span>
      </div>
      <hr style="border:none; border-top:1px solid ${tier.isHighlighted ? 'rgba(255,255,255,0.2)' : `${data.accentColor}20`}; margin:20px 0;">
      <ul style="list-style:none; padding:0; margin:0 0 32px; display:flex; flex-direction:column; gap:12px;">
        ${tier.features.map((f: string) => `<li style="display:flex; align-items:center; gap:10px; font-size:.95rem;"><span style="color:${tier.isHighlighted ? '#fff' : data.accentColor}; font-weight:700;">✓</span>${f}</li>`).join('')}
      </ul>
      <a href="#contacto" style="display:block; text-align:center; padding:16px; background:${tier.isHighlighted ? '#fff' : data.accentColor}; color:${tier.isHighlighted ? data.accentColor : '#fff'}; border-radius:14px; font-weight:700; text-decoration:none; font-size:1rem; transition:opacity .2s;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
        ${tier.ctaText}
      </a>
    </div>`).join('');

  return `
  <section style="background:${data.backgroundColor}; padding:100px 24px;">
    <div style="max-width:1200px; margin:0 auto;">
      <div style="text-align:center; margin-bottom:60px;">
        <div style="display:inline-block; width:48px; height:4px; background:${data.accentColor}; border-radius:999px; margin-bottom:20px;"></div>
        <h2 style="font-size:clamp(2rem,4vw,3.2rem); font-weight:900; color:${data.textColor}; margin:0 0 16px;">${data.title}</h2>
        <p style="font-size:1.15rem; color:${data.textColor}; opacity:.65;">${data.subtitle}</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:28px; align-items:center;">
        ${tiersHTML}
      </div>
    </div>
  </section>`;
}

function generateCustomFeatureHTML(data: any): string {
  const modules = (data.modules || []).map((module: string) => `<div style="padding:22px;background:#ffffff0d;border:1px solid #ffffff1a;border-radius:16px;font-weight:700;text-transform:capitalize;">${module.replace('_', ' ')}</div>`).join('');
  return `<section style="background:${data.backgroundColor};color:${data.textColor};padding:100px 24px;"><div style="max-width:1000px;margin:auto;text-align:center;"><span style="display:inline-block;background:${data.accentColor};color:#fff;padding:7px 14px;border-radius:999px;font-size:12px;font-weight:800;">PROPUESTA PERSONALIZADA</span><h2 style="font-size:clamp(2rem,5vw,3.5rem);margin:22px 0 12px;">${data.title}</h2><p style="opacity:.7;margin-bottom:40px;">${data.description}</p><div style="background:#0f172a;color:white;padding:28px;border-radius:28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;text-align:left;">${modules}</div><div style="margin-top:22px;padding:18px;border:1px solid ${data.accentColor}55;background:${data.accentColor}12;border-radius:16px;text-align:left;"><strong>Solicitud:</strong> “${data.request}”<br><small>${data.demoNotice}</small></div></div></section>`;
}

function renderBlock(block: Block, logoUrl?: string): string {
  switch (block.type) {
    case 'hero':         return generateHeroHTML(block.data, logoUrl);
    case 'services':     return generateServicesHTML(block.data);
    case 'gallery':      return generateGalleryHTML(block.data);
    case 'contact':      return generateContactHTML(block.data);
    case 'testimonials': return generateTestimonialsHTML(block.data);
    case 'pricing':      return generatePricingHTML(block.data);
    case 'custom_feature': return generateCustomFeatureHTML(block.data);
    default:             return '';
  }
}

export function exportProjectToHTML(project: WebsiteProject & { logoUrl?: string }): string {
  const { businessName, blocks, globalPalette, logoUrl } = project;

  const sortedBlocks = [...blocks]
    .sort((a, b) => a.order - b.order)
    .filter(b => b.isVisible);

  const blocksHTML = sortedBlocks.map(b => renderBlock(b, logoUrl)).join('\n');

  const navLogoHTML = logoUrl
    ? `<img src="${logoUrl}" alt="${businessName}" style="height:40px; object-fit:contain;">`
    : `<div style="width:36px; height:36px; border-radius:10px; background:${globalPalette.primary}; display:flex; align-items:center; justify-content:center; font-weight:900; color:#fff; font-size:1rem;">${businessName[0]}</div>`;

  const navbarHTML = `
  <nav id="navbar" style="position:fixed; top:0; left:0; right:0; z-index:1000; padding:16px 40px; display:flex; align-items:center; justify-content:space-between; transition:all .3s;">
    <div style="display:flex; align-items:center; gap:12px;">
      ${navLogoHTML}
      <span style="font-size:1.15rem; font-weight:800; color:${globalPalette.text}; letter-spacing:-.01em;">
        ${businessName}
      </span>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <a href="#contacto" style="padding:12px 28px; background:${globalPalette.primary}; color:#fff; border-radius:999px; text-decoration:none; font-size:.9rem; font-weight:700; box-shadow:0 4px 14px ${globalPalette.primary}40; transition:all .3s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
        Contáctanos
      </a>
    </div>
  </nav>
  <div style="height:72px;"></div>`;

  const footerHTML = `
  <footer style="background:${globalPalette.text}; color:${globalPalette.background}; padding:60px 24px 40px;">
    <div style="max-width:1200px; margin:0 auto; display:flex; flex-direction:column; align-items:center; gap:20px;">
      <div style="display:flex; align-items:center; gap:12px;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" style="height:48px; object-fit:contain; filter:brightness(0) invert(1);">` : ''}
        <span style="font-size:1.5rem; font-weight:900; letter-spacing:-.02em;">${businessName}</span>
      </div>
      <div style="width:60px; height:2px; background:${globalPalette.primary}; border-radius:999px;"></div>
      <p style="margin:0; font-size:.9rem; opacity:.5; text-align:center;">© ${new Date().getFullYear()} ${businessName} — Todos los derechos reservados</p>
    </div>
  </footer>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName}</title>
  <meta name="description" content="Sitio web oficial de ${businessName}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: ${globalPalette.background};
      color: ${globalPalette.text};
      line-height: 1.6;
    }
    img { max-width: 100%; display: block; }
    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-8px); }
    }
    @keyframes scroll {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(12px); opacity: 0; }
    }
    @media (max-width: 768px) {
      nav { padding: 12px 20px !important; }
      section > div { grid-template-columns: 1fr !important; }
    }
  </style>
</head>
<body>
  ${navbarHTML}
  <main>
    ${blocksHTML}
  </main>
  ${footerHTML}
  <script>
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = '${globalPalette.background}f0';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.08)';
        navbar.style.padding = '10px 40px';
      } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '16px 40px';
      }
    });

    // Form submit handler
    function handleFormSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = '✓ Mensaje enviado';
      btn.style.background = '#10B981';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        e.target.reset();
      }, 3000);
    }

    // Animación de entrada para elementos
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.style.opacity = '1';
          el.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity .7s ease, transform .7s ease';
      observer.observe(section);
    });
  </script>
</body>
</html>`;
}

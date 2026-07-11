import Link from "next/link";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

const CONTACT = {
  name: "Milton Alcaraz",
  email: "miltonjan3@gmail.com",
  whatsapp: "3121000883",
  instagram: "@tu_instagram",
  facebook: "tu.facebook",
  tiktok: "@tu_tiktok",
};

const FEATURES = [
  { icon: "zap", title: "Listo en 60 segundos", description: "Responde 5 preguntas y la IA genera tu sitio completo al instante con textos y colores personalizados." },
  { icon: "palette", title: "Tu color de marca", description: "Elige el color que representa tu negocio y toda la paleta se adapta automaticamente con contraste perfecto." },
  { icon: "edit", title: "Editor en vivo", description: "Haz clic en cualquier texto para editarlo directamente. Cambia colores y reordena secciones en tiempo real." },
  { icon: "file", title: "Archivo listo para subir", description: "Descarga un HTML autocontenido que funciona en cualquier hosting del mundo, incluso cPanel basico." },
  { icon: "money", title: "Cotizacion instantanea", description: "El precio se calcula automaticamente segun el sector y funcionalidades. Sin llamadas, sin esperar." },
  { icon: "image", title: "Con tu logo", description: "Sube tu logo y se integra automaticamente en el navbar, hero y footer del sitio generado." },
];

const SECTORS = [
  { icon: "💅", label: "Belleza y Spa" },
  { icon: "🍽", label: "Restaurante" },
  { icon: "💪", label: "Fitness" },
  { icon: "🛍", label: "Retail" },
  { icon: "💼", label: "Profesional" },
  { icon: "📚", label: "Educacion" },
];

const STEPS = [
  { num: "01", icon: "📝", title: "Nombre y sector", description: "Dinos como se llama tu negocio y en que industria operas." },
  { num: "02", icon: "⚙️", title: "Funcionalidades", description: "Selecciona que secciones necesitas: citas, galeria, menu, precios y mas." },
  { num: "03", icon: "🎨", title: "Color y logo", description: "Elige tu color de marca y sube tu logo. La IA genera la paleta completa." },
  { num: "04", icon: "✨", title: "Sitio generado", description: "En segundos tienes un sitio profesional listo para editar y descargar." },
];

const STATS = [
  { value: 50, suffix: "+", label: "Sitios generados" },
  { value: 6, suffix: "", label: "Sectores disponibles" },
  { value: 60, suffix: "s", label: "Tiempo de generacion" },
  { value: 100, suffix: "%", label: "Personalizado con IA" },
];

const FAQ = [
  { q: "Necesito saber programar?", a: "No. El sistema genera todo automaticamente. Solo respondes preguntas y descargas el resultado." },
  { q: "El sitio funciona en cualquier hosting?", a: "Si. Se genera un archivo HTML que funciona en Hostinger, GoDaddy, cPanel o cualquier hosting del mundo." },
  { q: "Puedo modificar el sitio despues?", a: "Si. Puedes editar textos en el editor, cambiar colores globales y reordenar secciones antes de descargar." },
  { q: "Que pasa si no me gusta el resultado?", a: "Puedes regenerar cuantas veces quieras antes de confirmar. Cada generacion produce un resultado diferente." },
  { q: "El precio incluye el hosting?", a: "No. El precio es por el diseno y desarrollo del sitio. El cliente paga su propio hosting por separado." },
];

const waUrl = "https://wa.me/523121000883?text=Hola%20Milton%2C%20me%20interesa%20un%20sitio%20web";

const ICON_MAP: Record<string, string> = {
  zap: "⚡", palette: "🎨", edit: "✏️", file: "📁", money: "💰", image: "🖼️",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm">M</div>
            <span className="font-bold text-lg tracking-tight">Milton<span className="text-blue-400">Dev</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#sectores" className="hover:text-white transition-colors">Sectores</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <Link href="/onboarding" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all hover:scale-105">
            Generar sitio
          </Link>
        </div>
      </nav>

      <section className="pt-36 pb-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-600/6 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-cyan-600/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8 animate-fade-in-down">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Generacion de sitios web con Inteligencia Artificial
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight animate-fade-in-up delay-100">
            Tu sitio web listo
            <span className="text-shimmer"> en 60 segundos</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Responde 5 preguntas, la IA genera contenido profesional y personalizado. Cotizacion automatica incluida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <Link href="/onboarding" className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-blue-600/25">
              Crear mi sitio gratis
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-lg font-semibold transition-all hover:scale-105">
              Hablar por WhatsApp
            </a>
          </div>
          <p className="mt-6 text-slate-500 text-sm animate-fade-in delay-400">Sin registro, sin tarjeta, resultado en segundos</p>
        </div>
      </section>

      <section className="py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(function(stat, i) {
              return (
                <ScrollReveal key={stat.label} delay={i * 100}>
                  <div className="text-center">
                    <div className="text-4xl font-black text-white mb-1">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="sectores" className="py-10 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-slate-500 text-sm mb-6 uppercase tracking-widest">Sectores disponibles</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SECTORS.map(function(s, i) {
              return (
                <ScrollReveal key={s.label} delay={i * 60} direction="up">
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/8 rounded-full text-sm text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-default">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Proceso</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Asi de simple</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">De cero a sitio web profesional en menos de 2 minutos.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map(function(step, i) {
              return (
                <ScrollReveal key={step.num} delay={i * 120} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group cursor-default">
                    <div className="text-6xl font-black text-white/4 absolute top-4 right-6 select-none">{step.num}</div>
                    <div className="text-3xl mb-5">{step.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Caracteristicas</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Todo lo que necesitas</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">Sin codigo, sin disenador, sin esperas.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(function(f, i) {
              return (
                <ScrollReveal key={f.title} delay={i * 80}>
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all group h-full">
                    <div className="text-3xl mb-4">{ICON_MAP[f.icon] || f.icon}</div>
                    <h3 className="font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-28 px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-cyan-600/10 border border-blue-500/20">
              <div className="text-5xl mb-6">🚀</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Listo para ver tu sitio?</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">Genera ahora una vista previa con cotizacion instantanea. Es gratis.</p>
              <Link href="/onboarding" className="inline-block px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xl font-bold transition-all hover:scale-105 shadow-2xl shadow-blue-600/30">
                Generar mi sitio gratis
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="faq" className="py-28 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-4xl font-black tracking-tight mb-4">Preguntas frecuentes</h2>
            </div>
          </ScrollReveal>
          <div className="space-y-3">
            {FAQ.map(function(item, i) {
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <span className="text-blue-400">?</span>
                      {item.q}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed pl-5">{item.a}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Contacto</p>
              <h2 className="text-4xl font-black tracking-tight mb-4">Hablemos</h2>
              <p className="text-slate-400">Tienes dudas o quieres cotizar directamente? Escribeme.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ScrollReveal delay={0} direction="left">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-green-500/10 border border-green-500/20 hover:border-green-500/40 hover:bg-green-500/15 transition-all group h-full">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💬</div>
                <div className="text-center">
                  <p className="font-bold text-white mb-1">WhatsApp</p>
                  <p className="text-green-400 font-mono text-sm">{CONTACT.whatsapp}</p>
                  <p className="text-slate-500 text-xs mt-1">Respondo en minutos</p>
                </div>
              </a>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <a href={"mailto:" + CONTACT.email} className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/15 transition-all group h-full">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✉️</div>
                <div className="text-center">
                  <p className="font-bold text-white mb-1">Email</p>
                  <p className="text-blue-400 text-sm break-all">{CONTACT.email}</p>
                  <p className="text-slate-500 text-xs mt-1">Para cotizaciones formales</p>
                </div>
              </a>
            </ScrollReveal>
            <ScrollReveal delay={200} direction="right">
              <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-violet-500/10 border border-violet-500/20 h-full">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center text-2xl">📱</div>
                <div className="text-center">
                  <p className="font-bold text-white mb-3">Redes sociales</p>
                  <div className="flex flex-col gap-2 text-sm">
                    <span className="text-violet-400">{CONTACT.instagram}</span>
                    <span className="text-violet-400">{CONTACT.facebook}</span>
                    <span className="text-violet-400">{CONTACT.tiktok}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">M</div>
            <span className="font-bold text-sm">Milton<span className="text-blue-400">Dev</span></span>
          </div>
          <p className="text-slate-500 text-sm">2026 {CONTACT.name} Todos los derechos reservados</p>
          <Link href="/onboarding" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">Generar sitio</Link>
        </div>
      </footer>

      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 transition-all hover:scale-110" title="Contactar por WhatsApp">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
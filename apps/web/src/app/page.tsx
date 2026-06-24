// app/page.tsx — Landing page / Home
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30">
          ✨ Generado con IA en segundos
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Tu sitio web,
          <span className="text-blue-400"> listo en minutos</span>
        </h1>

        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Responde 3 preguntas simples. Nuestra IA genera tu sitio web
          profesional personalizado. Sin código, sin diseñador.
        </p>

        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          Crear mi sitio web gratis
          <span>→</span>
        </Link>

        <p className="mt-6 text-slate-500 text-sm">
          Sin tarjeta de crédito · Listo en 60 segundos
        </p>
      </div>
    </main>
  );
}

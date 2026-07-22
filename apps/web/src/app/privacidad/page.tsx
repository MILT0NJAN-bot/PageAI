import Link from 'next/link';

export default function PrivacyPage() {
  return <main className="min-h-screen bg-[#080b14] px-6 py-16 text-white"><div className="mx-auto max-w-3xl"><Link href="/" className="text-sm text-[#a8f46a]">← Volver a CraftPage</Link><h1 className="mt-10 text-4xl font-semibold">Aviso de privacidad</h1><p className="mt-6 leading-7 text-white/65">En CraftPage usamos los datos que compartes para crear tu propuesta web, responder tus consultas y dar seguimiento a tu solicitud. No vendemos tus datos ni los usamos para fines distintos a la atención del servicio.</p><p className="mt-5 leading-7 text-white/65">Puedes solicitar información, corrección o eliminación de tus datos escribiendo a <a className="text-[#9ba8ff]" href="mailto:pagecraft2026@gmail.com">pagecraft2026@gmail.com</a>.</p></div></main>;
}

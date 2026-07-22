import Link from 'next/link';

export default function TermsPage() {
  return <main className="min-h-screen bg-[#080b14] px-6 py-16 text-white"><div className="mx-auto max-w-3xl"><Link href="/" className="text-sm text-[#a8f46a]">← Volver a CraftPage</Link><h1 className="mt-10 text-4xl font-semibold">Términos básicos</h1><p className="mt-6 leading-7 text-white/65">La propuesta generada por CraftPage es una demostración para revisar contenido y dirección visual. La publicación definitiva, dominio, alojamiento y funciones adicionales se acuerdan y cotizan por separado.</p><p className="mt-5 leading-7 text-white/65">El usuario es responsable de contar con derechos sobre los logotipos, imágenes y textos que proporcione. CraftPage puede actualizar estas condiciones para mantener el servicio seguro y claro.</p></div></main>;
}

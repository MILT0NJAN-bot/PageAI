// app/onboarding/page.tsx — Paso de onboarding
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import Link from 'next/link';

export const metadata = { title: 'Crea tu sitio — PageAI' };

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Page<span className="text-blue-600">AI</span>
          </Link>
          <span className="text-sm text-slate-500">Paso 1 de 1 — Configura tu sitio</span>
        </div>
      </header>

      {/* Formulario */}
      <div className="max-w-3xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Cuéntanos sobre tu negocio
          </h1>
          <p className="text-lg text-slate-500">
            Con esta información, nuestra IA generará un sitio web 100% personalizado para ti.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}

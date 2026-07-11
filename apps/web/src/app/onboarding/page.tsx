import { OnboardingForm } from '@/components/onboarding/OnboardingForm';

export const metadata = { title: 'Crea tu sitio — MiltonDev' };

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <OnboardingForm />
    </div>
  );
}
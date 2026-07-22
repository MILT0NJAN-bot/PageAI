import { OnboardingForm } from '@/components/onboarding/OnboardingForm';

export const metadata = { title: 'Crea tu sitio — CraftPage' };

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#080b14]">
      <OnboardingForm />
    </div>
  );
}

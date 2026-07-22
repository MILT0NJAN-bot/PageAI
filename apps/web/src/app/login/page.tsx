'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [challenge, setChallenge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const codeRequested = Boolean(challenge);

  async function requestCode(event?: FormEvent) {
    event?.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('/api/auth/admin-challenge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.challenge) throw new Error(data.error || 'No se pudo validar el acceso');
      setChallenge(data.challenge); setOtp('');
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo validar el acceso'); }
    finally { setLoading(false); }
  }

  async function finishLogin(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('');
    const result = await signIn('credentials', { email, password, otp, challenge, redirect: false, callbackUrl: '/admin' });
    if (result?.error) { setError('El código es incorrecto, venció o el acceso está bloqueado.'); setLoading(false); return; }
    router.replace('/admin'); router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080b14] px-6 py-16 text-white">
      <div className="hero-grid absolute inset-0 opacity-40" /><div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-[#6578ff]/15 blur-[100px]" />
      <div className="relative w-full max-w-[430px]">
        <div className="mb-8 text-center"><img src="/craftpage-logo.png" alt="CraftPage" className="mx-auto mb-5 h-16 w-52 rounded-xl object-cover object-center" /><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#a8f46a]">Acceso protegido</p><h1 className="text-3xl font-semibold tracking-[-.04em]">Panel administrativo</h1><p className="mt-3 text-sm text-[#858da1]">Contraseña y verificación de un solo uso.</p></div>
        <form onSubmit={codeRequested ? finishLogin : requestCode} className="rounded-2xl border border-white/10 bg-[#111625]/90 p-7 shadow-2xl backdrop-blur-xl">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#c8cdda]">Correo administrativo<input type="email" autoComplete="username" required disabled={codeRequested} value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none transition focus:border-[#6578ff] disabled:opacity-55" /></label>
            {!codeRequested && <label className="block text-sm font-medium text-[#c8cdda]">Contraseña<input type="password" autoComplete="current-password" required minLength={12} maxLength={200} value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-white outline-none transition focus:border-[#6578ff]" /></label>}
            {codeRequested && <label className="block text-sm font-medium text-[#c8cdda]">Código enviado por correo<input type="text" inputMode="numeric" autoComplete="one-time-code" autoFocus required pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} className="mt-2 w-full rounded-xl border border-[#6578ff]/50 bg-white/[.04] px-4 py-3 text-center text-xl font-semibold tracking-[.45em] text-white outline-none focus:border-[#a8f46a]" /></label>}
          </div>
          {codeRequested && <div className="mt-4 flex items-center justify-between gap-4 text-xs"><span className="text-[#858da1]">El código caduca en 10 minutos.</span><button type="button" onClick={()=>{setChallenge('');setOtp('');setError('')}} className="text-[#9ba8ff] hover:text-white">Volver</button></div>}
          {error && <div role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</div>}
          <button type="submit" disabled={loading || (codeRequested && otp.length!==6)} className="mt-6 w-full rounded-xl bg-[#6578ff] py-3.5 font-bold transition hover:bg-[#7486ff] disabled:cursor-not-allowed disabled:opacity-45">{loading ? 'Validando…' : codeRequested ? 'Verificar e ingresar' : 'Continuar de forma segura'}</button>
        </form>
        <p className="mt-6 text-center text-xs text-[#5f677a]">Los intentos fallidos se registran y bloquean temporalmente.</p>
      </div>
    </main>
  );
}

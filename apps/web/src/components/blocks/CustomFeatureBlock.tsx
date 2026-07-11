'use client';

import type { CustomFeatureBlockData, CustomModule } from '@shared/types';

interface Props { data: CustomFeatureBlockData; }

const LABELS: Record<CustomModule, string> = {
  login: 'Acceso seguro', dashboard: 'Panel de cliente', appointments: 'Mis citas', orders: 'Mis pedidos',
  memberships: 'Membresía', courses: 'Mis cursos', quotes: 'Cotizador', catalog: 'Catálogo', custom: 'Función especial',
};

export function CustomFeatureBlock({ data }: Props) {
  const showLogin = data.modules.includes('login');
  return (
    <section className="px-6 py-24" style={{ backgroundColor: data.backgroundColor, color: data.textColor }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold text-white mb-4" style={{ backgroundColor: data.accentColor }}>PROPUESTA PERSONALIZADA</span>
          <h2 className="text-3xl md:text-5xl font-black mb-4">{data.title}</h2>
          <p className="opacity-70 max-w-2xl mx-auto">{data.description}</p>
        </div>
        <div className="grid md:grid-cols-[.8fr_1.4fr] gap-6 items-stretch">
          {showLogin && (
            <div className="rounded-3xl bg-white p-7 text-slate-900 shadow-xl border border-slate-100">
              <div className="w-12 h-12 rounded-2xl text-white flex items-center justify-center text-xl mb-6" style={{ backgroundColor: data.accentColor }}>↳</div>
              <h3 className="text-xl font-black mb-1">Bienvenido</h3><p className="text-sm text-slate-500 mb-6">Accede a tu cuenta</p>
              <div className="space-y-3"><div className="h-11 rounded-xl bg-slate-100 px-4 flex items-center text-sm text-slate-400">Correo electrónico</div><div className="h-11 rounded-xl bg-slate-100 px-4 flex items-center text-sm text-slate-400">Contraseña</div></div>
              <button className="w-full mt-5 py-3 rounded-xl text-white font-bold" style={{ backgroundColor: data.accentColor }}>{data.loginButtonText}</button>
            </div>
          )}
          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5"><div><p className="text-xs text-slate-400">Área privada</p><p className="font-bold">Mi panel</p></div><div className="w-9 h-9 rounded-full" style={{ backgroundColor: data.accentColor }} /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.modules.filter(module => module !== 'login').map(module => <div key={module} className="p-4 bg-white/5 border border-white/10 rounded-2xl"><p className="text-xs text-slate-400 mb-3">Módulo</p><p className="font-bold">{LABELS[module]}</p><div className="mt-4 h-2 bg-white/10 rounded-full"><div className="h-full w-2/3 rounded-full" style={{ backgroundColor: data.accentColor }} /></div></div>)}
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 rounded-2xl border text-sm" style={{ borderColor: `${data.accentColor}55`, backgroundColor: `${data.accentColor}12` }}><strong>Solicitud:</strong> “{data.request}”<br/><span className="opacity-70">{data.demoNotice}</span></div>
      </div>
    </section>
  );
}

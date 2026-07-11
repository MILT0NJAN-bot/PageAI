'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { WebsiteProject } from '@shared/types';

const STATUSES = [
  ['NEW','Nuevo'], ['CONTACTED','Contactado'], ['QUOTED','Cotización enviada'], ['APPROVED','Aprobado'],
  ['IN_PROGRESS','En desarrollo'], ['WAITING_CLIENT','Esperando cliente'], ['PUBLISHED','Publicado'], ['ARCHIVED','Archivado'],
] as const;

export function ProjectAdminForm({ project }: { project: WebsiteProject }) {
  const router = useRouter();
  const [status, setStatus] = useState(project.status || 'NEW');
  const [adminNotes, setAdminNotes] = useState(project.adminNotes || '');
  const [estimatedPrice, setEstimatedPrice] = useState(project.estimatedPrice?.toString() || '');
  const [finalPrice, setFinalPrice] = useState(project.finalPrice?.toString() || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    setSaving(true); setMessage('');
    const response = await fetch(`/api/admin/projects/${project.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, adminNotes: adminNotes || null, estimatedPrice: estimatedPrice ? Number(estimatedPrice) : null, finalPrice: finalPrice ? Number(finalPrice) : null }) });
    setMessage(response.ok ? 'Cambios guardados' : 'No se pudieron guardar los cambios'); setSaving(false); router.refresh();
  }

  return <div className="grid lg:grid-cols-[1fr_.8fr] gap-6"><section className="rounded-2xl bg-white/[.04] border border-white/10 p-6"><h2 className="font-bold text-lg mb-5">Seguimiento comercial</h2><label className="block text-sm text-slate-400 mb-2">Estado</label><select value={status} onChange={e => setStatus(e.target.value as WebsiteProject['status'])} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 mb-5">{STATUSES.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><div className="grid sm:grid-cols-2 gap-4 mb-5"><label className="text-sm text-slate-400">Precio estimado<input type="number" value={estimatedPrice} onChange={e => setEstimatedPrice(e.target.value)} className="mt-2 w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white" /></label><label className="text-sm text-slate-400">Precio final<input type="number" value={finalPrice} onChange={e => setFinalPrice(e.target.value)} className="mt-2 w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white" /></label></div><label className="block text-sm text-slate-400 mb-2">Notas privadas</label><textarea rows={8} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 resize-y" placeholder="Acuerdos, pendientes, fecha de seguimiento..."/><div className="flex items-center gap-3 mt-4"><button onClick={save} disabled={saving} className="px-5 py-3 bg-blue-600 rounded-xl font-bold disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar seguimiento'}</button>{message && <span className="text-sm text-slate-400">{message}</span>}</div></section><aside className="rounded-2xl bg-white/[.04] border border-white/10 p-6"><h2 className="font-bold text-lg mb-4">Solicitud del cliente</h2><p className="text-slate-400 whitespace-pre-wrap">{project.customRequest || 'Sin solicitud especial.'}</p><div className="mt-6 pt-6 border-t border-white/10 text-sm text-slate-400 space-y-2"><p><strong className="text-white">Sector:</strong> {project.sector}</p><p><strong className="text-white">Creado:</strong> {new Date(project.createdAt).toLocaleString('es-MX')}</p></div></aside></div>;
}

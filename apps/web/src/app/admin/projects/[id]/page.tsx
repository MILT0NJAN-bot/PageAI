import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { WebsiteProject } from '@shared/types';
import { ProjectAdminForm } from '@/components/admin/ProjectAdminForm';
import { DemoControls } from '@/components/admin/DemoControls';
export default async function AdminProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions); if (!session) redirect('/login');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/projects/${params.id}`, { headers: { 'x-admin-key': process.env.ADMIN_API_KEY || '' }, cache: 'no-store' });
  if (!response.ok) notFound(); const project: WebsiteProject = await response.json();
  return <main className="min-h-screen bg-slate-950 text-white px-6 py-10"><div className="max-w-6xl mx-auto"><Link href="/admin" className="text-sm text-blue-400">← Volver al panel</Link><div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-7"><div><p className="text-slate-500 text-sm">Proyecto</p><h1 className="text-3xl font-black">{project.businessName}</h1></div><div className="flex gap-2"><Link href={`/preview/${project.id}?token=${encodeURIComponent(project.accessToken || '')}`} target="_blank" className="px-4 py-2 bg-white/10 rounded-xl">Vista para compartir</Link><Link href={`/editor/${project.id}`} className="px-4 py-2 bg-blue-600 rounded-xl">Editar</Link><a href={`/api/admin/projects/${project.id}/export`} className="px-4 py-2 bg-emerald-600 rounded-xl">HTML</a></div></div><DemoControls project={project}/><ProjectAdminForm project={project}/></div></main>;
}

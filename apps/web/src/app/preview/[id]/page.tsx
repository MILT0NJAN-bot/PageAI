import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { WebsiteProject } from '@shared/types';
import { PublicSite } from '@/components/public/PublicSite';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface Props { params: Promise<{ id: string }>; searchParams: Promise<{ edit?: string; token?: string }>; }

async function getProject(id: string, token?: string, isAdmin = false): Promise<WebsiteProject | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/projects/${id}`, { cache: 'no-store', headers: isAdmin ? { 'x-admin-key': process.env.ADMIN_API_KEY || '' } : token ? { 'x-project-token': token } : {} });
    return response.ok ? response.json() : null;
  } catch { return null; }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const routeParams = await params; const query = await searchParams;
  const session = await getServerSession(authOptions);
  const project = await getProject(routeParams.id, query.token, Boolean(session));
  return { title: project ? `${project.businessName} — Vista previa` : 'Página no encontrada' };
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const routeParams = await params; const query = await searchParams;
  const session = await getServerSession(authOptions);
  const project = await getProject(routeParams.id, query.token, Boolean(session));
  if (!project) notFound();
  return <PublicSite project={project} canEdit={query.edit === '1'} />;
}

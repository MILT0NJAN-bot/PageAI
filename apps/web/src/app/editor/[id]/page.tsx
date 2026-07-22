import { LiveEditor } from '@/components/editor/LiveEditor';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { WebsiteProject } from '@shared/types';

interface EditorPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ logoUrl?: string; token?: string }>;
}

async function getProject(id: string, token?: string, isAdmin = false): Promise<WebsiteProject | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/projects/${id}`, { cache: 'no-store', headers: isAdmin ? { 'x-admin-key': process.env.ADMIN_API_KEY || '' } : token ? { 'x-project-token': token } : {} });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const routeParams = await params; const query = await searchParams;
  const session = await getServerSession(authOptions);
  const project = await getProject(routeParams.id, query.token, Boolean(session));
  if (!project) notFound();
  if (!session && project.demoExpiresAt && new Date(project.demoExpiresAt) < new Date()) redirect(`/preview/${project.id}?token=${encodeURIComponent(query.token || '')}`);

  const logoUrl = query?.logoUrl;

  return (
    <LiveEditor
      initialProject={project}
      logoUrl={logoUrl}
      isAdmin={Boolean(session)}
    />
  );
}

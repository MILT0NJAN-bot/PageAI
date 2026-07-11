import { LiveEditor } from '@/components/editor/LiveEditor';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { WebsiteProject } from '@shared/types';

interface EditorPageProps {
  params: { id: string };
  searchParams: { logoUrl?: string };
}

async function getProject(id: string): Promise<WebsiteProject | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/projects/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const [project, session] = await Promise.all([
    getProject(params.id),
    getServerSession(authOptions),
  ]);
  if (!project) notFound();

  const logoUrl = searchParams?.logoUrl;

  return (
    <LiveEditor
      initialProject={project}
      logoUrl={logoUrl}
      isAdmin={Boolean(session)}
    />
  );
}

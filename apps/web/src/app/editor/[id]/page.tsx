// app/editor/[id]/page.tsx — Página del editor (Server Component que fetcha el proyecto)
import { LiveEditor } from '@/components/editor/LiveEditor';
import { notFound } from 'next/navigation';
import type { WebsiteProject } from '@shared/types';

interface EditorPageProps {
  params: { id: string };
}

// Fetcha el proyecto desde el backend en el servidor
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

export default async function EditorPage({ params }: EditorPageProps) {
  const project = await getProject(params.id);
  if (!project) notFound();

  return <LiveEditor initialProject={project} />;
}

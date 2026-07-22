import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/projects/${routeParams.id}/export`, { headers: { 'x-admin-key': process.env.ADMIN_API_KEY || '' }, cache: 'no-store' });
  return new NextResponse(await response.arrayBuffer(), { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') || 'text/html; charset=utf-8', 'Content-Disposition': response.headers.get('content-disposition') || 'attachment' } });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function forward(req: NextRequest, id: string, method: 'GET' | 'PUT' | 'DELETE') {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/projects/${id}`, { method, headers: { 'Content-Type': 'application/json', 'x-admin-key': process.env.ADMIN_API_KEY || '' }, body: method === 'PUT' ? await req.text() : undefined, cache: 'no-store' });
  if (response.status === 204) return new NextResponse(null, { status: 204 });
  return NextResponse.json(await response.json(), { status: response.status });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { return forward(req, (await params).id, 'GET'); }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { return forward(req, (await params).id, 'PUT'); }
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { return forward(req, (await params).id, 'DELETE'); }

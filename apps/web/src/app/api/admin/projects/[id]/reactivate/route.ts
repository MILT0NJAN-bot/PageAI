import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function POST(_req:NextRequest,{params}:{params:{id:string}}){const session=await getServerSession(authOptions);if(!session)return NextResponse.json({error:'No autorizado'},{status:401});const api=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001';const response=await fetch(`${api}/api/projects/${params.id}/reactivate`,{method:'POST',headers:{'x-admin-key':process.env.ADMIN_API_KEY||''}});return NextResponse.json(await response.json(),{status:response.status})}

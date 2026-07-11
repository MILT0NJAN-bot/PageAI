import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getProjects() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/projects?limit=50`, { cache: 'no-store', headers: { 'x-admin-key': process.env.ADMIN_API_KEY || '' } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.projects || [];
  } catch {
    return [];
  }
}

async function getLeads() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/leads`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.leads || [];
  } catch {
    return [];
  }
}

const SECTOR_LABELS: Record<string, string> = {
  beauty: 'Belleza', restaurant: 'Restaurante', fitness: 'Fitness',
  retail: 'Retail', professional: 'Profesional', education: 'Educacion',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const [projects, leads] = await Promise.all([getProjects(), getLeads()]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar admin */}
      <nav className="border-b border-white/5 bg-slate-900/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm">P</div>
            <div>
              <p className="font-bold text-sm">Page AI Admin</p>
              <p className="text-slate-400 text-xs">{session.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              Ver landing
            </Link>
            <Link href="/api/auth/signout" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              Cerrar sesion
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Proyectos totales', value: projects.length, color: 'blue' },
            { label: 'Leads capturados', value: leads.length, color: 'green' },
            { label: 'Este mes', value: projects.filter((p: any) => new Date(p.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, color: 'violet' },
            { label: 'Conversion', value: projects.length > 0 ? Math.round((leads.length / projects.length) * 100) + '%' : '0%', color: 'amber' },
          ].map(stat => (
            <div key={stat.label} className="p-5 rounded-2xl bg-white/[0.03] border border-white/8">
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Proyectos recientes */}
          <div>
            <h2 className="text-lg font-bold mb-4">Proyectos recientes</h2>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <p className="text-slate-500 text-sm p-4">No hay proyectos aun</p>
              ) : (
                projects.slice(0, 10).map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all">
                    <div>
                      <p className="font-semibold text-white text-sm">{project.businessName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                          {SECTOR_LABELS[project.sector] || project.sector}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(project.createdAt).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                      {project.customRequest && <p className="mt-2 max-w-xs truncate text-xs text-violet-400" title={project.customRequest}>Solicitud especial: {project.customRequest}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Link href={'/admin/projects/' + project.id} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium transition-colors">Ficha</Link>
                      <Link href={'/preview/' + project.id + '?token=' + encodeURIComponent(project.accessToken)} target="_blank" className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-medium transition-colors">Vista</Link>
                      <Link
                        href={'/editor/' + project.id}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      <a
                        href={'/api/admin/projects/' + project.id + '/export'}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
                        download
                      >
                        HTML
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Leads capturados */}
          <div>
            <h2 className="text-lg font-bold mb-4">Leads capturados</h2>
            <div className="space-y-3">
              {leads.length === 0 ? (
                <p className="text-slate-500 text-sm p-4">No hay leads aun</p>
              ) : (
                leads.slice(0, 10).map((lead: any) => (
                  <div key={lead.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/8">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm">{lead.businessName}</p>
                        <p className="text-blue-400 text-xs mt-0.5">{lead.email}</p>
                        {lead.whatsapp && (
                          <a
                            href={'https://wa.me/52' + lead.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 text-xs hover:text-green-300 transition-colors"
                          >
                            WhatsApp: {lead.whatsapp}
                          </a>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full">
                          {SECTOR_LABELS[lead.sector] || lead.sector}
                        </span>
                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(lead.createdAt).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

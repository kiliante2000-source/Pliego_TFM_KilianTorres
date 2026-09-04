import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Archive, Trash2, Plus, LogOut, ExternalLink } from 'lucide-react';
import { Logo, Button, Input, Select } from '../components/ui/primitives';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import type { Project, TemplateInfo } from '../types/document';
import { formatDate } from '../utils/cn';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('Nuevo proyecto');
  const [templateId, setTemplateId] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, t] = await Promise.all([
        api.get<{ projects: Project[] }>('/api/projects'),
        api.get<{ templates: TemplateInfo[] }>('/api/projects/templates'),
      ]);
      setProjects(p.projects);
      setTemplates(t.templates);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const groupedTemplates = useMemo(() => {
    return templates.reduce<Record<string, TemplateInfo[]>>((acc, t) => {
      acc[t.category] = acc[t.category] || [];
      acc[t.category].push(t);
      return acc;
    }, {});
  }, [templates]);

  const createProject = async () => {
    setCreating(true);
    try {
      const res = await api.post<{ project: Project }>('/api/projects', {
        title,
        width: 1080,
        height: 1350,
        orientation: 'portrait',
        ...(templateId ? { templateId } : {}),
      });
      navigate(`/app/editor/${res.project.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-paper-muted sm:inline">{user?.name}</span>
            <Button
              variant="ghost"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
            >
              <LogOut size={16} />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-left"
        >
          <h1 className="font-display text-4xl text-paper sm:text-5xl">Tu estudio</h1>
          <p className="mt-2 max-w-2xl text-paper-muted">
            Proyectos, plantillas y publicaciones en un solo lugar.
          </p>
        </motion.section>

        <section className="mb-12 rounded-2xl border border-line bg-ink-2/70 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-paper-muted">
            Nuevo proyecto
          </h2>
          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_auto]">
            <Input label="Nombre" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Select
              label="Plantilla"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              <option value="">En blanco</option>
              {Object.entries(groupedTemplates).map(([category, items]) => (
                <optgroup key={category} label={category}>
                  {items.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
            <div className="flex items-end">
              <Button className="w-full md:w-auto" onClick={() => void createProject()} disabled={creating}>
                <Plus size={16} />
                {creating ? 'Creando…' : 'Crear'}
              </Button>
            </div>
          </div>
        </section>

        {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}

        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl text-paper">Proyectos</h2>
            <span className="text-xs text-paper-muted">{projects.length} activos</span>
          </div>

          {loading ? (
            <p className="text-paper-muted">Cargando proyectos…</p>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-paper-muted">
              Aún no hay proyectos. Crea el primero desde una plantilla o en blanco.
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="group overflow-hidden rounded-2xl border border-line bg-ink-2/80"
                >
                  <Link to={`/app/editor/${project.id}`} className="block no-underline">
                    <div
                      className="relative aspect-[4/3] border-b border-line"
                      style={{
                        background:
                          'linear-gradient(145deg, #1a1714 0%, #0c0b0a 45%, rgba(232,165,75,0.25) 100%)',
                      }}
                    >
                      <div className="absolute inset-0 flex items-end p-4">
                        <div>
                          <p className="font-display text-xl text-paper">{project.title}</p>
                          <p className="text-xs text-paper-muted">
                            {project.width}×{project.height} · {project.orientation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="text-[11px] text-paper-muted">{formatDate(project.updatedAt)}</span>
                    <div className="flex items-center gap-1">
                      {project.published ? (
                        <Link
                          to={`/p/${project.slug}`}
                          className="rounded p-1.5 text-accent hover:bg-ink-3"
                          title="Ver publicación"
                        >
                          <ExternalLink size={15} />
                        </Link>
                      ) : null}
                      <button
                        className="rounded p-1.5 text-paper-muted hover:bg-ink-3 hover:text-paper"
                        title="Duplicar"
                        onClick={async () => {
                          await api.post(`/api/projects/${project.id}/duplicate`);
                          await load();
                        }}
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        className="rounded p-1.5 text-paper-muted hover:bg-ink-3 hover:text-paper"
                        title="Archivar"
                        onClick={async () => {
                          await api.patch(`/api/projects/${project.id}`, { status: 'archived' });
                          await load();
                        }}
                      >
                        <Archive size={15} />
                      </button>
                      <button
                        className="rounded p-1.5 text-paper-muted hover:bg-danger/20 hover:text-danger"
                        title="Eliminar"
                        onClick={async () => {
                          if (!confirm('¿Eliminar este proyecto?')) return;
                          await api.delete(`/api/projects/${project.id}`);
                          await load();
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

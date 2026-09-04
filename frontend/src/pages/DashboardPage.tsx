import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Archive, Trash2, Plus, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { Logo, Button, Input } from '../components/ui/primitives';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import type { Project, TemplateInfo } from '../types/document';
import { cn, formatDate } from '../utils/cn';

const templateAccent: Record<string, string> = {
  portada: 'from-[#1a1510] via-[#0c0b0a] to-[#e3a045]',
  revista: 'from-[#2a241c] via-[#1a1612] to-[#d9cfc0]',
  catalogo: 'from-[#ece7df] via-[#cfc6b8] to-[#1a1612]',
  presentacion: 'from-[#141210] via-[#1c1916] to-[#e3a045]',
};

const categoryLabel: Record<string, string> = {
  portada: 'Portada',
  revista: 'Revista',
  catalogo: 'Catálogo',
  presentacion: 'Presentación',
};

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

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId],
  );

  const createProject = async () => {
    setCreating(true);
    try {
      const res = await api.post<{ project: Project }>('/api/projects', {
        title: title.trim() || 'Sin título',
        width: selectedTemplate?.width ?? 1080,
        height: selectedTemplate?.height ?? 1350,
        orientation: selectedTemplate?.orientation ?? 'portrait',
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
      <header className="sticky top-0 z-20 border-b border-line/70 bg-ink/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-paper">{user?.name}</p>
              <p className="text-[11px] text-paper-muted">{user?.email}</p>
            </div>
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

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-left"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Estudio</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
            Hola, {user?.name?.split(' ')[0] || 'creador'}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-muted sm:text-base">
            Elige una plantilla o parte de cero. Tus piezas viven aquí hasta publicarlas.
          </p>
        </motion.section>

        <section className="mb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-paper">Nuevo proyecto</h2>
              <p className="mt-1 text-sm text-paper-muted">Una plantilla, un nombre, y entras al canvas.</p>
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <button
              type="button"
              onClick={() => setTemplateId('')}
              className={cn(
                'group relative overflow-hidden rounded-xl border p-4 text-left transition duration-200',
                !templateId
                  ? 'border-accent bg-accent-soft'
                  : 'border-line bg-ink-2/50 hover:border-paper-muted/30 hover:bg-ink-3/60',
              )}
            >
              <div className="mb-6 flex h-16 items-end">
                <Sparkles className={cn('text-paper-muted', !templateId && 'text-accent')} size={22} />
              </div>
              <p className="text-sm font-semibold text-paper">En blanco</p>
              <p className="mt-1 text-xs text-paper-muted">1080 × 1350</p>
            </button>

            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTemplateId(t.id);
                  if (title === 'Nuevo proyecto' || title === '') {
                    setTitle(t.name);
                  }
                }}
                className={cn(
                  'group relative overflow-hidden rounded-xl border text-left transition duration-200',
                  templateId === t.id
                    ? 'border-accent ring-1 ring-accent/40'
                    : 'border-line hover:border-paper-muted/30',
                )}
              >
                <div
                  className={cn(
                    'h-24 bg-gradient-to-br',
                    templateAccent[t.category] || 'from-ink-3 to-ink',
                  )}
                />
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-paper-muted">
                    {categoryLabel[t.category] || t.category}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-paper">{t.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-paper-muted">{t.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Nombre del proyecto"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Portada primavera…"
              />
            </div>
            <Button
              className="sm:min-w-40"
              onClick={() => void createProject()}
              disabled={creating || !title.trim()}
            >
              <Plus size={16} />
              {creating ? 'Creando…' : 'Abrir en el editor'}
            </Button>
          </div>
          {error ? (
            <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl text-paper">Tus proyectos</h2>
              <p className="mt-1 text-sm text-paper-muted">
                {loading ? 'Cargando…' : `${projects.length} activos`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-xl border border-line bg-ink-2/60" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
              <p className="font-display text-xl text-paper">Aún no hay piezas</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-paper-muted">
                Empieza con una plantilla de portada o un lienzo en blanco. El editor guarda solo.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group overflow-hidden rounded-xl border border-line bg-ink-2/40 transition duration-200 hover:border-paper-muted/25 hover:bg-ink-2/70"
                >
                  <Link to={`/app/editor/${project.id}`} className="block no-underline">
                    <div
                      className="relative aspect-[4/3] overflow-hidden"
                      style={{
                        background:
                          project.published
                            ? 'linear-gradient(145deg, #1a1510 0%, #0c0b0a 40%, rgba(227,160,69,0.45) 100%)'
                            : 'linear-gradient(145deg, #1a1714 0%, #0c0b0a 55%, #26221e 100%)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-40 transition duration-500 group-hover:scale-[1.03]">
                        <div className="absolute left-6 top-8 font-display text-3xl text-paper/90">
                          {project.title.slice(0, 1)}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-accent/80" />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/20 to-transparent p-4">
                        <p className="font-display text-xl text-paper">{project.title}</p>
                        <p className="mt-1 text-xs text-paper-muted">
                          {project.width}×{project.height}
                          {project.published ? ' · Publicado' : ''}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <span className="text-[11px] text-paper-muted">{formatDate(project.updatedAt)}</span>
                    <div className="flex items-center gap-0.5">
                      {project.published ? (
                        <Link
                          to={`/p/${project.slug}`}
                          className="rounded-md p-1.5 text-accent transition hover:bg-ink-3"
                          title="Ver publicación"
                        >
                          <ExternalLink size={15} />
                        </Link>
                      ) : null}
                      <IconAction
                        title="Duplicar"
                        onClick={async () => {
                          await api.post(`/api/projects/${project.id}/duplicate`);
                          await load();
                        }}
                      >
                        <Copy size={15} />
                      </IconAction>
                      <IconAction
                        title="Archivar"
                        onClick={async () => {
                          await api.patch(`/api/projects/${project.id}`, { status: 'archived' });
                          await load();
                        }}
                      >
                        <Archive size={15} />
                      </IconAction>
                      <IconAction
                        title="Eliminar"
                        danger
                        onClick={async () => {
                          if (!confirm('¿Eliminar este proyecto?')) return;
                          await api.delete(`/api/projects/${project.id}`);
                          await load();
                        }}
                      >
                        <Trash2 size={15} />
                      </IconAction>
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

function IconAction({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void | Promise<void>;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-md p-1.5 text-paper-muted transition hover:bg-ink-3 hover:text-paper',
        danger && 'hover:bg-danger/15 hover:text-danger',
      )}
      title={title}
      onClick={() => void onClick()}
    >
      {children}
    </button>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Archive, Trash2, Plus, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Input } from '../components/ui/primitives';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import type { Project, TemplateInfo } from '../types/document';
import { cn, formatDate } from '../utils/cn';

const templateAccent: Record<string, string> = {
  portada: 'from-neon/40 via-violet/30 to-rosa/40',
  revista: 'from-violet/35 via-ink-3 to-neon/25',
  catalogo: 'from-paper/20 via-ink-3 to-naranja/30',
  presentacion: 'from-neon/30 via-rosa/25 to-lima/20',
};

const categoryLabel: Record<string, string> = {
  portada: 'Portada',
  revista: 'Revista',
  catalogo: 'Catálogo',
  presentacion: 'Presentación',
};

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'projects';

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
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neon">
          {tab === 'templates'
            ? 'Plantillas'
            : tab === 'assets'
              ? 'Recursos'
              : tab === 'versions'
                ? 'Versiones'
                : tab === 'settings'
                  ? 'Ajustes'
                  : 'Proyectos'}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          {tab === 'projects' || tab === 'templates'
            ? `Hola, ${user?.name?.split(' ')[0] || 'creador'}`
            : tab === 'assets'
              ? 'Recursos'
              : tab === 'versions'
                ? 'Versiones'
                : 'Ajustes'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-muted">
          {tab === 'projects' || tab === 'templates'
            ? 'Diseña, edita y publica tus proyectos editoriales desde el navegador.'
            : tab === 'assets'
              ? 'Los recursos de cada proyecto se gestionan dentro del editor.'
              : tab === 'versions'
                ? 'Las versiones viven en cada documento. Ábrelo para crear o restaurar snapshots.'
                : 'Preferencias de cuenta y estudio.'}
        </p>
      </motion.section>

      {(tab === 'projects' || tab === 'templates') && (
        <>
          <section className="mb-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-paper">Nuevo proyecto</h2>
                <p className="mt-1 font-mono text-[11px] text-paper-muted">
                  Plantilla · nombre · canvas
                </p>
              </div>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <button
                type="button"
                onClick={() => setTemplateId('')}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border p-4 text-left transition',
                  !templateId
                    ? 'border-neon/60 bg-accent-soft'
                    : 'border-line bg-ink-2/50 hover:border-paper-muted/25',
                )}
              >
                <div className="mb-6 flex h-16 items-end">
                  <Sparkles className={cn('text-paper-muted', !templateId && 'text-neon')} size={22} />
                </div>
                <p className="text-sm font-semibold text-paper">En blanco</p>
                <p className="mt-1 font-mono text-[10px] text-paper-muted">1080 × 1350</p>
              </button>

              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTemplateId(t.id);
                    if (title === 'Nuevo proyecto' || !title) setTitle(t.name);
                  }}
                  className={cn(
                    'overflow-hidden rounded-2xl border text-left transition',
                    templateId === t.id
                      ? 'border-neon ring-1 ring-neon/40'
                      : 'border-line hover:border-paper-muted/25',
                  )}
                >
                  <div className={cn('h-24 bg-gradient-to-br', templateAccent[t.category])} />
                  <div className="p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted">
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
                className="sm:min-w-44"
                onClick={() => void createProject()}
                disabled={creating || !title.trim()}
              >
                <Plus size={16} />
                {creating ? 'Creando…' : 'Abrir editor'}
                <ArrowRight size={16} />
              </Button>
            </div>
            {error ? (
              <p className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
          </section>

          {tab === 'projects' && (
            <section>
              <div className="mb-5">
                <h2 className="font-display text-2xl font-bold text-paper">Tus proyectos</h2>
                <p className="mt-1 font-mono text-[11px] text-paper-muted">
                  {loading ? 'Cargando…' : `${projects.length} activos`}
                </p>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-56 animate-pulse rounded-2xl border border-line bg-ink-2/60" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
                  <p className="font-display text-xl font-bold text-paper">Aún no hay piezas</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-paper-muted">
                    Empieza con una plantilla o un lienzo en blanco.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <motion.li
                      key={project.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="group overflow-hidden rounded-2xl border border-line bg-ink-2/40 transition hover:border-neon/30 hover:bg-ink-2/70"
                    >
                      <Link to={`/app/editor/${project.id}`} className="block no-underline">
                        <div className="relative aspect-[4/3] overflow-hidden mesh-bg">
                          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                          <div className="absolute inset-0 flex flex-col justify-end p-4">
                            <p className="font-display text-xl font-bold text-paper">{project.title}</p>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-muted">
                              {project.width}×{project.height}
                              {project.published ? ' · Publicado' : ''}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <span className="font-mono text-[10px] text-paper-muted">
                          {formatDate(project.updatedAt)}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {project.published ? (
                            <Link
                              to={`/p/${project.slug}`}
                              className="rounded-lg p-1.5 text-neon transition hover:bg-ink-3"
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
          )}
        </>
      )}

      {tab === 'assets' && (
        <EmptyPanel
          title="Recursos por proyecto"
          body="Sube imágenes desde el editor. Cada recurso queda vinculado al documento activo."
          cta={projects[0] ? `/app/editor/${projects[0].id}` : undefined}
        />
      )}
      {tab === 'versions' && (
        <EmptyPanel
          title="Historial de versiones"
          body="Abre un proyecto y usa Versiones en la barra superior para crear o restaurar snapshots."
          cta={projects[0] ? `/app/editor/${projects[0].id}` : undefined}
        />
      )}
      {tab === 'settings' && (
        <div className="glass max-w-lg rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold text-paper">Cuenta</h2>
          <dl className="mt-4 space-y-3 font-mono text-xs">
            <div>
              <dt className="text-paper-muted">Nombre</dt>
              <dd className="mt-1 text-sm text-paper">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-paper-muted">Email</dt>
              <dd className="mt-1 text-sm text-paper">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-paper-muted">Rol</dt>
              <dd className="mt-1 text-sm text-paper">{user?.role}</dd>
            </div>
          </dl>
        </div>
      )}
    </main>
  );
}

function EmptyPanel({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: string;
}) {
  return (
    <div className="glass max-w-xl rounded-2xl p-8">
      <h2 className="font-display text-2xl font-bold text-paper">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-paper-muted">{body}</p>
      {cta ? (
        <ButtonLinkLike to={cta} />
      ) : null}
    </div>
  );
}

function ButtonLinkLike({ to }: { to: string }) {
  return (
    <Link to={to} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neon no-underline hover:underline">
      Abrir proyecto
      <ArrowRight size={16} />
    </Link>
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
        'rounded-lg p-1.5 text-paper-muted transition hover:bg-ink-3 hover:text-paper',
        danger && 'hover:bg-danger/15 hover:text-danger',
      )}
      title={title}
      onClick={() => void onClick()}
    >
      {children}
    </button>
  );
}

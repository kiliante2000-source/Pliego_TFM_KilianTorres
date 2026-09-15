import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Archive, Trash2, Plus, ExternalLink, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui/primitives';
import { BlankTemplateCard, TemplateCard } from '../components/dashboard/TemplateCards';
import { ProjectCover, projectKindLabel } from '../components/dashboard/ProjectCover';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import type { Project, TemplateInfo } from '../types/document';
import { cn, formatDate } from '../utils/cn';

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
    <main className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-neon/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-rosa/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-violet/10 blur-3xl" />

      <motion.section
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-12"
      >
        <p className="eyebrow text-neon">
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
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-[-0.055em] text-paper sm:text-7xl">
          {tab === 'projects' || tab === 'templates'
            ? `Hola, ${user?.name?.split(' ')[0] || 'creador'}`
            : tab === 'assets'
              ? 'Recursos'
              : tab === 'versions'
                ? 'Versiones'
                : 'Ajustes'}
        </h1>
        <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-paper/65 sm:text-xl">
          {tab === 'projects' || tab === 'templates'
            ? 'Diseña, edita y publica piezas editoriales con la energía de un estudio creativo.'
            : tab === 'assets'
              ? 'Los recursos de cada proyecto se gestionan dentro del editor.'
              : tab === 'versions'
                ? 'Las versiones viven en cada documento. Ábrelo para crear o restaurar snapshots.'
                : 'Preferencias de cuenta y estudio.'}
        </p>
        <div className="editorial-rule mt-8 max-w-md" />
      </motion.section>

      {(tab === 'projects' || tab === 'templates') && (
        <>
          <section className="mb-14">
            <div className="mb-6">
              <p className="eyebrow text-paper/40">Componer</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] text-paper">
                Nuevo proyecto
              </h2>
              <p className="mt-2 font-serif text-base text-paper/55">
                Elige plantilla, nombra la pieza y abre el canvas.
              </p>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <BlankTemplateCard selected={!templateId} onSelect={() => setTemplateId('')} />
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  selected={templateId === t.id}
                  onSelect={() => {
                    setTemplateId(t.id);
                    if (title === 'Nuevo proyecto' || !title) setTitle(t.name);
                  }}
                />
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
              <div className="mb-6">
                <p className="eyebrow text-paper/40">Archivo</p>
                <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] text-paper">
                  Tus proyectos
                </h2>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-paper-muted">
                  {loading ? 'Cargando…' : `${projects.length} activos`}
                </p>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-56 animate-pulse rounded-sm border border-white/10 bg-ink-2/60" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="border-t border-white/15 px-2 py-16 text-center sm:px-6">
                  <p className="eyebrow text-rosa">Vacío</p>
                  <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-paper">
                    Aún no hay piezas
                  </p>
                  <p className="mx-auto mt-3 max-w-sm font-serif text-lg text-paper/55">
                    Empieza con una plantilla o un lienzo en blanco.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <motion.li
                      key={project.id}
                      initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -6 }}
                      className="group overflow-hidden rounded-sm border border-white/10 bg-ink-2/50 transition hover:border-white/25 hover:shadow-[0_24px_70px_rgba(79,128,255,0.14)]"
                    >
                      <Link to={`/app/editor/${project.id}`} className="block no-underline">
                        <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                          <ProjectCover project={project} />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4">
                            <p className="font-display text-xl font-bold leading-tight text-paper sm:text-2xl">
                              {project.title}
                            </p>
                            <p className="mt-1.5 text-xs leading-snug text-paper-muted">
                              <span className="text-paper/80">{projectKindLabel(project)}</span>
                              <span className="mx-1.5 text-paper-muted/50">·</span>
                              <span className="font-mono text-xs uppercase tracking-[0.12em]">
                                {project.width}×{project.height}
                              </span>
                              {project.published ? (
                                <span className="ml-1.5 font-mono text-xs uppercase tracking-[0.12em] text-neon">
                                  · Publicado
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <span className="font-mono text-xs text-paper-muted">
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
        <div className="max-w-lg border-t border-white/15 pt-8">
          <p className="eyebrow text-neon">Cuenta</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-paper">
            Tu estudio
          </h2>
          <p className="mt-2 font-serif text-base text-paper/55">Preferencias de identidad y acceso.</p>
          <div className="editorial-rule mt-6 mb-8 w-24" />
          <dl className="space-y-5">
            <div className="border-b border-white/8 pb-4">
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-paper-muted">Nombre</dt>
              <dd className="mt-1.5 font-display text-lg font-bold text-paper">{user?.name}</dd>
            </div>
            <div className="border-b border-white/8 pb-4">
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-paper-muted">Email</dt>
              <dd className="mt-1.5 text-sm text-paper">{user?.email}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-paper-muted">Rol</dt>
              <dd className="mt-1.5 font-mono text-xs uppercase tracking-[0.14em] text-neon">{user?.role}</dd>
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
    <div className="max-w-xl border-t border-white/15 pt-8">
      <p className="eyebrow text-rosa">Nota</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-paper">{title}</h2>
      <p className="mt-3 font-serif text-lg leading-relaxed text-paper/60">{body}</p>
      {cta ? <ButtonLinkLike to={cta} /> : null}
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

import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Archive, Trash2, ExternalLink } from 'lucide-react';
import {
  BlankCanvasLaunch,
  BLANK_FORMATS,
  TemplateGallery,
  type BlankFormatId,
} from '../components/dashboard/TemplateCards';
import { ProjectCover, projectKindLabel } from '../components/dashboard/ProjectCover';
import {
  StudioAssetsPanel,
  StudioSettingsPanel,
  StudioVersionsPanel,
  getStudioDefaultFormat,
} from '../components/dashboard/StudioHub';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import type { Project, TemplateInfo } from '../types/document';
import { cn, formatDate } from '../utils/cn';

function prefsToBlankFormatId(): BlankFormatId {
  const f = getStudioDefaultFormat();
  if (f.width === 1080 && f.height === 1080) return 'square';
  if (f.width === 1440 && f.height === 900) return 'landscape';
  if (f.width === 1920 && f.height === 1080) return 'presentation';
  return 'story';
}

function stickyNavOffset() {
  const sticky = document.querySelector('[data-studio-sticky]') as HTMLElement | null;
  // Mobile sticky header + tab row; desktop has no sticky bar over content
  return sticky ? sticky.getBoundingClientRect().height + 10 : 12;
}

function scrollToStudioSection(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - stickyNavOffset());
  window.scrollTo({ top, behavior: 'auto' });
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'projects';

  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('En blanco');
  const [blankFormatId, setBlankFormatId] = useState<BlankFormatId>(prefsToBlankFormatId);
  const [creating, setCreating] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [projectQuery, setProjectQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<'all' | 'published' | 'draft'>('all');

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

  // Land on each section’s primary heading, fully below the sticky mobile chrome
  useEffect(() => {
    const fromHash = location.hash.replace(/^#/, '');
    const target =
      fromHash ||
      (tab === 'templates' ? 'coleccion-plantillas' : 'studio-hello');

    const run = () => scrollToStudioSection(target);
    const t0 = window.setTimeout(run, 0);
    const t1 = window.setTimeout(run, 100);
    const t2 = window.setTimeout(run, 360);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [tab, location.hash, location.key, templates.length, loading]);

  const filteredProjects = useMemo(() => {
    const q = projectQuery.trim().toLowerCase();
    return projects.filter((p) => {
      if (projectFilter === 'published' && !p.published) return false;
      if (projectFilter === 'draft' && p.published) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    });
  }, [projects, projectQuery, projectFilter]);

  const blankFormat =
    BLANK_FORMATS.find((f) => f.id === blankFormatId) ?? BLANK_FORMATS[0];

  const createProject = async (opts: { templateId?: string; title: string }) => {
    if (creating) return;
    const nextTemplate = opts.templateId
      ? templates.find((t) => t.id === opts.templateId)
      : undefined;
    const nextTitle = opts.title.trim() || nextTemplate?.name || 'Sin título';
    setCreating(true);
    setOpeningId(opts.templateId || 'blank');
    setError(null);
    try {
      const res = await api.post<{ project: Project }>('/api/projects', {
        title: nextTitle,
        width: nextTemplate?.width ?? blankFormat.width,
        height: nextTemplate?.height ?? blankFormat.height,
        orientation: nextTemplate?.orientation ?? blankFormat.orientation,
        ...(opts.templateId ? { templateId: opts.templateId } : {}),
      });
      navigate(`/app/editor/${res.project.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear');
      setCreating(false);
      setOpeningId(null);
    }
  };

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-neon/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-rosa/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-violet/10 blur-3xl" />

      <motion.section
        id="studio-hello"
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8 scroll-mt-[7.5rem] sm:mb-12 sm:scroll-mt-6"
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
        <h1 className="mt-2 font-display text-[1.85rem] font-extrabold tracking-[-0.045em] text-paper sm:mt-3 sm:text-7xl sm:tracking-[-0.055em]">
          {tab === 'projects' || tab === 'templates'
            ? `Hola, ${user?.name?.split(' ')[0] || 'creador'}`
            : tab === 'assets'
              ? 'Recursos'
              : tab === 'versions'
                ? 'Versiones'
                : 'Ajustes'}
        </h1>
        <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-paper/65 sm:mt-4 sm:text-xl">
          {tab === 'projects' || tab === 'templates'
            ? 'Diseña, edita y publica piezas editoriales con la energía de un estudio creativo.'
            : tab === 'assets'
              ? 'Los recursos de cada proyecto se gestionan dentro del editor.'
              : tab === 'versions'
                ? 'Las versiones viven en cada documento. Ábrelo para crear o restaurar snapshots.'
                : 'Preferencias de cuenta y estudio.'}
        </p>
        <div className="editorial-rule mt-6 max-w-md sm:mt-8" />
      </motion.section>

      {(tab === 'projects' || tab === 'templates') && (
        <>
          <section className="mb-16">
            <div className="mb-6">
              <p className="eyebrow text-paper/70">Componer</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-paper sm:text-3xl">
                Nuevo proyecto
              </h2>
            </div>

            {/* 1 · Lienzo — zona visualmente aparte (papel claro) */}
            <div className="mb-14">
              <BlankCanvasLaunch
                title={title}
                onTitleChange={setTitle}
                formatId={blankFormatId}
                onFormatChange={setBlankFormatId}
                opening={creating && openingId === 'blank'}
                onOpen={() =>
                  void createProject({ title: title.trim() || 'En blanco' })
                }
              />
              {error && openingId === 'blank' ? (
                <p className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
                  {error}
                </p>
              ) : null}
            </div>

            {/* 2 · Plantillas — posters cinéticos 3+3 bento */}
            <div id="coleccion-plantillas" className="scroll-mt-[7.5rem] sm:scroll-mt-6">
              <TemplateGallery
                templates={templates}
                openingId={openingId}
                onOpen={(t) => void createProject({ templateId: t.id, title: t.name })}
              />
              {error && openingId && openingId !== 'blank' ? (
                <p className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </section>

          {tab === 'projects' && (
            <section>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-paper/70">Archivo</p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] text-paper">
                    Tus proyectos
                  </h2>
                  <p className="mt-2 font-mono text-base uppercase tracking-[0.12em] text-paper/70">
                    {loading ? 'Cargando…' : `${filteredProjects.length} de ${projects.length}`}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={projectQuery}
                    onChange={(e) => setProjectQuery(e.target.value)}
                    placeholder="Buscar pieza…"
                    className="rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-sm text-paper outline-none focus:border-neon/40 sm:w-48"
                  />
                  <div className="flex rounded-full border border-white/10 bg-ink-2 p-0.5">
                    {(
                      [
                        ['all', 'Todos'],
                        ['draft', 'Borrador'],
                        ['published', 'Publicado'],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setProjectFilter(id)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                          projectFilter === id
                            ? 'bg-neon text-white'
                            : 'text-paper/60 hover:text-paper',
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-56 animate-pulse rounded-sm border border-white/10 bg-ink-2/60" />
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="border-t border-white/15 px-2 py-16 text-center sm:px-6">
                  <p className="eyebrow text-rosa">Vacío</p>
                  <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-paper">
                    {projects.length === 0 ? 'Aún no hay piezas' : 'Sin coincidencias'}
                  </p>
                  <p className="mx-auto mt-3 max-w-sm font-serif text-lg text-paper/72">
                    {projects.length === 0
                      ? 'Empieza con una plantilla o un lienzo en blanco.'
                      : 'Prueba otro filtro o limpia la búsqueda.'}
                  </p>
                </div>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project, index) => (
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
                            <p className="mt-1.5 text-base leading-snug text-paper/70">
                              <span className="text-paper/80">{projectKindLabel(project)}</span>
                              <span className="mx-1.5 text-paper/70/50">·</span>
                              <span className="font-mono text-base uppercase tracking-[0.12em]">
                                {project.width}×{project.height}
                              </span>
                              {project.published ? (
                                <span className="ml-1.5 font-mono text-base uppercase tracking-[0.12em] text-neon">
                                  · Publicado
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <span className="font-mono text-base text-paper/70">
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

      {tab === 'assets' && <StudioAssetsPanel projects={projects} />}
      {tab === 'versions' && <StudioVersionsPanel projects={projects} />}
      {tab === 'settings' && (
        <StudioSettingsPanel
          userName={user?.name}
          userEmail={user?.email}
          userRole={user?.role}
        />
      )}
    </main>
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
        'rounded-lg p-1.5 text-paper/70 transition hover:bg-ink-3 hover:text-paper',
        danger && 'hover:bg-danger/15 hover:text-danger',
      )}
      title={title}
      onClick={() => void onClick()}
    >
      {children}
    </button>
  );
}

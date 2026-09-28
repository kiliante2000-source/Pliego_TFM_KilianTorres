import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  HardDrive,
  History,
  ImagePlus,
  Loader2,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { api } from '../../services/api';
import { Button, Input } from '../ui/primitives';
import type { Project, ProjectVersion } from '../../types/document';
import { cn, formatDate } from '../../utils/cn';

export type LibraryAsset = {
  id: string;
  projectId: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  url: string;
  project: { id: string; title: string; slug: string };
};

type LibraryVersion = ProjectVersion & {
  projectId: string;
  project: { id: string; title: string; slug: string; width: number; height: number };
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function StudioAssetsPanel({ projects }: { projects: Project[] }) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(projects[0]?.id ?? '');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ assets: LibraryAsset[] }>('/api/projects/library/assets');
      setAssets(res.assets);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los recursos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!uploadTarget && projects[0]) setUploadTarget(projects[0].id);
  }, [projects, uploadTarget]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter((a) => {
      if (filterProject !== 'all' && a.projectId !== filterProject) return false;
      if (!q) return true;
      return (
        a.filename.toLowerCase().includes(q) ||
        a.project.title.toLowerCase().includes(q) ||
        a.mimeType.toLowerCase().includes(q)
      );
    });
  }, [assets, filterProject, query]);

  const totalBytes = assets.reduce((s, a) => s + a.size, 0);

  const onUpload = async (file: File) => {
    if (!uploadTarget) {
      setError('Crea un proyecto antes de subir recursos');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      await api.upload(`/api/projects/${uploadTarget}/assets`, file);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Archivos"
          value={String(assets.length)}
          hint="En tu biblioteca"
          accent="text-neon"
        />
        <StatCard
          label="Peso total"
          value={formatBytes(totalBytes)}
          hint="Imágenes vinculadas"
          accent="text-lima"
        />
        <StatCard
          label="Proyectos"
          value={String(new Set(assets.map((a) => a.projectId)).size)}
          hint="Con recursos"
          accent="text-rosa"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-paper/55">
              Buscar
            </label>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre, proyecto, tipo…"
                className="w-full rounded-xl border border-white/10 bg-ink px-9 py-2.5 text-sm text-paper outline-none transition focus:border-neon/40"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-paper/55">
              Proyecto
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-neon/40"
            >
              <option value="all">Todos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-52">
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-paper/55">
              Subir a
            </label>
            <select
              value={uploadTarget}
              onChange={(e) => setUploadTarget(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-neon/40"
              disabled={!projects.length}
            >
              {projects.length === 0 ? (
                <option value="">Sin proyectos</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))
              )}
            </select>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-neon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-2">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            {uploading ? 'Subiendo…' : 'Subir imagen'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading || !uploadTarget}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUpload(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
        {error ? (
          <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl border border-white/8 bg-ink-2/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<HardDrive size={22} />}
          title="Biblioteca vacía"
          body="Sube imágenes aquí o desde el editor. Quedarán ligadas al proyecto que elijas."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <li
              key={asset.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-2/50 transition hover:border-white/20"
            >
              <div className="relative aspect-[4/3] bg-ink">
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/60 to-transparent p-3">
                  <p className="truncate text-sm font-semibold text-paper">{asset.filename}</p>
                  <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.12em] text-paper/60">
                    {formatBytes(asset.size)} · {asset.mimeType.split('/')[1]}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <Link
                  to={`/app/editor/${asset.projectId}`}
                  className="truncate text-sm text-paper/70 no-underline hover:text-neon"
                >
                  {asset.project.title}
                </Link>
                <div className="flex items-center gap-0.5">
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg p-1.5 text-paper/60 transition hover:bg-ink-3 hover:text-paper"
                    title="Abrir archivo"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    type="button"
                    title="Eliminar"
                    className="rounded-lg p-1.5 text-paper/60 transition hover:bg-danger/15 hover:text-danger"
                    onClick={async () => {
                      if (!confirm(`¿Eliminar ${asset.filename}?`)) return;
                      await api.delete(`/api/projects/library/assets/${asset.id}`);
                      await load();
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function StudioVersionsPanel({ projects }: { projects: Project[] }) {
  const [versions, setVersions] = useState<LibraryVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ versions: LibraryVersion[] }>('/api/projects/library/versions');
      setVersions(res.versions);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () =>
      versions.filter((v) => (filterProject === 'all' ? true : v.projectId === filterProject)),
    [versions, filterProject],
  );

  const snapshotProject = async (projectId: string) => {
    setBusyId(projectId);
    try {
      await api.post(`/api/projects/${projectId}/versions`, {
        label: `Snapshot estudio · ${new Date().toLocaleString('es-ES')}`,
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la versión');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Snapshots"
          value={String(versions.length)}
          hint="En todos tus proyectos"
          accent="text-neon"
        />
        <StatCard
          label="Último"
          value={versions[0] ? formatDate(versions[0].createdAt) : '—'}
          hint={versions[0]?.project.title ?? 'Sin historial'}
          accent="text-violet"
        />
        <StatCard
          label="Proyectos"
          value={String(projects.length)}
          hint="Activos en el estudio"
          accent="text-lima"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <p className="eyebrow text-neon">Captura rápida</p>
            <p className="mt-2 max-w-xl font-serif text-base text-paper/70">
              Guarda el estado actual de un proyecto sin abrir el editor. Ideal antes de un cambio
              grande de tipografía o motion.
            </p>
          </div>
          <div className="sm:w-56">
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-paper/55">
              Filtrar historial
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-neon/40"
            >
              <option value="all">Todos los proyectos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {projects.slice(0, 6).map((p) => (
              <button
                key={p.id}
                type="button"
                disabled={busyId === p.id}
                onClick={() => void snapshotProject(p.id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-ink px-3 py-1.5 text-sm text-paper/80 transition hover:border-neon/40 hover:text-paper disabled:opacity-50"
              >
                {busyId === p.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <History size={14} className="text-neon" />
                )}
                Snapshot · {p.title}
              </button>
            ))}
          </div>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-white/8 bg-ink-2/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<History size={22} />}
          title="Sin versiones todavía"
          body="Crea un snapshot aquí o desde el editor (botón Versiones). Podrás restaurar el documento en un clic."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((v) => (
            <li
              key={v.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink-2/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-neon">
                  v{v.versionNumber} · {v.project.title}
                </p>
                <p className="mt-1 truncate font-display text-lg font-bold tracking-tight text-paper">
                  {v.label || `Versión ${v.versionNumber}`}
                </p>
                <p className="mt-1 font-mono text-xs text-paper/55">
                  {formatDate(v.createdAt)}
                  {v.user?.name ? ` · ${v.user.name}` : ''}
                  {` · ${v.project.width}×${v.project.height}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/app/editor/${v.projectId}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 text-sm font-semibold text-paper no-underline transition hover:border-neon/40"
                >
                  Abrir
                  <ArrowRight size={14} />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink-3 px-3 py-1.5 text-sm font-semibold text-paper transition hover:bg-ink-4"
                  disabled={busyId === v.id}
                  onClick={async () => {
                    if (!confirm(`¿Restaurar «${v.label}» en ${v.project.title}?`)) return;
                    setBusyId(v.id);
                    try {
                      await api.post(`/api/projects/${v.projectId}/versions/${v.id}/restore`);
                      await load();
                    } catch (e) {
                      setError(e instanceof Error ? e.message : 'No se pudo restaurar');
                    } finally {
                      setBusyId(null);
                    }
                  }}
                >
                  <RotateCcw size={14} />
                  Restaurar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function StudioSettingsPanel({ userName, userEmail, userRole }: {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}) {
  const [name, setName] = useState(userName ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState(() => readStudioPrefs());

  useEffect(() => {
    setName(userName ?? '');
  }, [userName]);

  const savePrefs = (next: StudioPrefs) => {
    setPrefs(next);
    writeStudioPrefs(next);
    setMessage('Preferencias del estudio guardadas');
  };

  return (
    <section className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-5">
          <p className="eyebrow text-neon">Identidad</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-paper">
            Perfil del estudio
          </h3>
          <p className="mt-2 font-serif text-base text-paper/65">
            Nombre visible en el estudio y en el historial de versiones.
          </p>
          <div className="mt-5 space-y-4">
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper/55">Email</p>
              <p className="mt-1 text-sm text-paper/80">{userEmail}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-paper/55">Rol</p>
              <p className="mt-1 font-mono text-sm uppercase tracking-[0.12em] text-neon">
                {userRole}
              </p>
            </div>
            <Button
              disabled={saving || name.trim().length < 2}
              onClick={async () => {
                setSaving(true);
                setError(null);
                setMessage(null);
                try {
                  const { useAuthStore } = await import('../../stores/authStore');
                  await useAuthStore.getState().updateProfile(name.trim());
                  setMessage('Perfil actualizado');
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'No se pudo guardar');
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? 'Guardando…' : 'Guardar perfil'}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-2/60 p-5">
          <p className="eyebrow text-lima">Estudio</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-paper">
            Preferencias creativas
          </h3>
          <p className="mt-2 font-serif text-base text-paper/65">
            Ajustes locales de este navegador: no afectan a otros dispositivos.
          </p>
          <ul className="mt-5 space-y-3">
            <PrefToggle
              title="Guía al abrir editor"
              hint="Muestra el tutorial la primera vez (o de nuevo si lo activas)."
              checked={prefs.showGuide}
              onChange={(showGuide) => {
                savePrefs({ ...prefs, showGuide });
                try {
                  if (showGuide) localStorage.removeItem('pliego-studio-guide-v1');
                  else localStorage.setItem('pliego-studio-guide-v1', 'done');
                } catch {
                  /* ignore */
                }
              }}
            />
            <PrefToggle
              title="Reducir motion en UI"
              hint="Suaviza animaciones de interfaz (no las del Preview)."
              checked={prefs.reduceMotion}
              onChange={(reduceMotion) => {
                savePrefs({ ...prefs, reduceMotion });
                document.documentElement.classList.toggle('pliego-reduce-motion', reduceMotion);
              }}
            />
            <PrefToggle
              title="Flash de acciones"
              hint="Confirmaciones breves al insertar, guardar o alinear."
              checked={prefs.actionFlash}
              onChange={(actionFlash) => savePrefs({ ...prefs, actionFlash })}
            />
          </ul>

          <div className="mt-5">
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-paper/55">
              Formato por defecto (lienzo en blanco)
            </label>
            <select
              value={prefs.defaultFormat}
              onChange={(e) =>
                savePrefs({
                  ...prefs,
                  defaultFormat: e.target.value as StudioPrefs['defaultFormat'],
                })
              }
              className="w-full rounded-xl border border-white/10 bg-ink px-3 py-2.5 text-sm text-paper outline-none focus:border-neon/40"
            >
              <option value="story">Story 1080×1350</option>
              <option value="landscape">Landscape 1440×900</option>
              <option value="square">Cuadrado 1080×1080</option>
              <option value="presentation">Presentación 1920×1080</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-4 text-sm font-medium text-paper/55 transition hover:text-neon"
            onClick={() => {
              try {
                localStorage.removeItem('pliego-studio-layout-v1');
                localStorage.removeItem('pliego-studio-layout-v2');
              } catch {
                /* ignore */
              }
              setMessage('Layout de columnas restablecido (recarga el editor)');
            }}
          >
            Restablecer anchos de columnas del editor
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-white/15 bg-ink/40 p-5">
        <p className="eyebrow text-rosa">Atajos del estudio</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            ['⌘P', 'Preview interactiva'],
            ['⌘S', 'Guardar documento'],
            ['⌘Z / ⌘⇧Z', 'Deshacer / rehacer'],
            ['⌘D', 'Duplicar selección'],
            ['Doble clic texto', 'Editar en canvas'],
            ['Arrastrar bordes', 'Redimensionar columnas'],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-ink-2/50 px-3 py-2.5"
            >
              <span className="text-sm text-paper/75">{v}</span>
              <kbd className="rounded-md bg-ink px-2 py-1 font-mono text-xs text-neon">{k}</kbd>
            </div>
          ))}
        </div>
      </div>

      {message ? <p className="text-sm text-lima">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </section>
  );
}

type StudioPrefs = {
  showGuide: boolean;
  reduceMotion: boolean;
  actionFlash: boolean;
  defaultFormat: 'story' | 'landscape' | 'square' | 'presentation';
};

const PREFS_KEY = 'pliego-studio-prefs-v1';

function readStudioPrefs(): StudioPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) {
      return { showGuide: true, reduceMotion: false, actionFlash: true, defaultFormat: 'story' };
    }
    return { ...{ showGuide: true, reduceMotion: false, actionFlash: true, defaultFormat: 'story' as const }, ...JSON.parse(raw) };
  } catch {
    return { showGuide: true, reduceMotion: false, actionFlash: true, defaultFormat: 'story' };
  }
}

function writeStudioPrefs(prefs: StudioPrefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

export function getStudioDefaultFormat() {
  const prefs = readStudioPrefs();
  switch (prefs.defaultFormat) {
    case 'landscape':
      return { width: 1440, height: 900, orientation: 'landscape' as const };
    case 'square':
      return { width: 1080, height: 1080, orientation: 'portrait' as const };
    case 'presentation':
      return { width: 1920, height: 1080, orientation: 'landscape' as const };
    default:
      return { width: 1080, height: 1350, orientation: 'portrait' as const };
  }
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-2/50 px-4 py-4">
      <p className={cn('font-mono text-xs uppercase tracking-[0.14em]', accent)}>{label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-paper">{value}</p>
      <p className="mt-1 text-sm text-paper/55">{hint}</p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-ink-3 text-neon">
        {icon}
      </div>
      <p className="font-display text-2xl font-extrabold tracking-tight text-paper">{title}</p>
      <p className="mx-auto mt-2 max-w-md font-serif text-base text-paper/65">{body}</p>
    </div>
  );
}

function PrefToggle({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-xl border border-white/8 bg-ink/40 px-3 py-3 text-left transition hover:border-white/15"
    >
      <span
        className={cn(
          'mt-0.5 grid h-5 w-9 shrink-0 place-items-center rounded-full transition',
          checked ? 'bg-neon' : 'bg-ink-3',
        )}
      >
        <span
          className={cn(
            'h-3.5 w-3.5 rounded-full bg-white transition',
            checked ? 'translate-x-2' : '-translate-x-2',
          )}
        />
      </span>
      <span>
        <span className="block text-sm font-semibold text-paper">{title}</span>
        <span className="block text-sm text-paper/55">{hint}</span>
      </span>
    </button>
  );
}

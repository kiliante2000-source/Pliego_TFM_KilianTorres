import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Cloud,
  CloudOff,
  Download,
  Globe,
  History,
  Loader2,
} from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { PagesLayersPanel } from '../components/editor/PagesLayersPanel';
import { Button, Input } from '../components/ui/primitives';
import { api } from '../services/api';
import type { ProjectVersion } from '../types/document';
import { formatDate } from '../utils/cn';

export function EditorPage() {
  const { projectId } = useParams();
  const loadProject = useEditorStore((s) => s.loadProject);
  const reset = useEditorStore((s) => s.reset);
  const project = useEditorStore((s) => s.project);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  const saveNow = useEditorStore((s) => s.saveNow);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copySelected = useEditorStore((s) => s.copySelected);
  const pasteClipboard = useEditorStore((s) => s.pasteClipboard);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const documentModel = useEditorStore((s) => s.document);

  const [error, setError] = useState<string | null>(null);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setError(null);
    loadProject(projectId).catch((e) =>
      setError(e instanceof Error ? e.message : 'No se pudo cargar el proyecto'),
    );
    return () => reset();
  }, [projectId, loadProject, reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (meta && e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if (meta && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
      if (meta && e.key.toLowerCase() === 'c') {
        copySelected();
      }
      if (meta && e.key.toLowerCase() === 'v') {
        pasteClipboard();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        deleteSelected();
      }
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void saveNow();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, copySelected, pasteClipboard, deleteSelected, saveNow]);

  const refreshVersions = async () => {
    if (!projectId) return;
    const data = await api.get<{ versions: ProjectVersion[] }>(
      `/api/projects/${projectId}/versions`,
    );
    setVersions(data.versions);
  };

  if (error) {
    return (
      <div className="grid min-h-svh place-items-center bg-ink mesh-bg-soft px-6">
        <div className="max-w-md text-center">
          <p className="eyebrow text-rosa">Error</p>
          <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-paper">
            No se pudo abrir
          </p>
          <p className="mt-3 font-serif text-base text-danger/90">{error}</p>
          <Link
            to="/app"
            className="mt-8 inline-flex rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-accent-2"
          >
            Volver al estudio
          </Link>
        </div>
      </div>
    );
  }

  if (!project || !documentModel || !projectId) {
    return (
      <div className="grid min-h-svh place-items-center bg-ink mesh-bg-soft">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-neon" size={22} />
          <p className="eyebrow text-neon">Editor</p>
          <p className="mt-3 font-display text-xl font-bold text-paper">Abriendo canvas…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-ink">
      <header className="flex items-center justify-between gap-3 border-b border-white/8 bg-[#080b0f]/95 px-3 py-2.5 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            to="/app"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-paper-muted no-underline transition hover:bg-white/5 hover:text-paper"
            title="Volver al estudio"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <Input
              className="border-transparent bg-transparent px-1 py-0.5 font-display text-lg font-extrabold tracking-[-0.04em] focus:border-white/15 focus:bg-ink/40"
              value={documentModel.meta.title}
              onChange={(e) => {
                useEditorStore.getState().updateDocument((doc) => ({
                  ...doc,
                  meta: { ...doc.meta, title: e.target.value },
                }));
                void api.patch(`/api/projects/${projectId}`, { title: e.target.value });
              }}
            />
            <div className="flex items-center gap-2 px-1 font-mono text-xs uppercase tracking-[0.12em] text-paper-muted">
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 size={12} className="animate-spin text-neon" /> Guardando…
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Cloud size={12} className="text-success" /> Guardado
                  {lastSavedAt ? ` · ${formatDate(lastSavedAt)}` : ''}
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <CloudOff size={12} className="text-danger" /> Error al guardar
                </>
              ) : (
                'Listo para editar'
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="soft"
            className="hidden sm:inline-flex"
            onClick={async () => {
              setVersionsOpen(true);
              await refreshVersions();
            }}
          >
            <History size={15} />
            Versiones
          </Button>
          <Button
            variant="soft"
            disabled={exporting}
            onClick={async () => {
              setExporting(true);
              try {
                await saveNow();
                const res = await api.post<{ export: { id: string } }>(
                  `/api/projects/${projectId}/export/pdf`,
                );
                window.open(`/api/projects/exports/${res.export.id}/download`, '_blank');
              } catch (e) {
                alert(e instanceof Error ? e.message : 'Error al exportar');
              } finally {
                setExporting(false);
              }
            }}
          >
            <Download size={15} />
            {exporting ? 'Exportando…' : 'PDF'}
          </Button>
          <Button
            variant={project.published ? 'primary' : 'soft'}
            disabled={publishing}
            onClick={async () => {
              setPublishing(true);
              try {
                const next = !project.published;
                const res = await api.patch<{ project: typeof project }>(
                  `/api/projects/${projectId}`,
                  {
                    published: next,
                    visibility: next ? 'public' : project.visibility,
                  },
                );
                useEditorStore.setState({ project: res.project });
              } finally {
                setPublishing(false);
              }
            }}
          >
            <Globe size={15} />
            {project.published ? 'Publicado' : 'Publicar'}
          </Button>
          {project.published ? (
            <Link
              to={`/p/${project.slug}`}
              className="hidden text-xs font-medium text-neon no-underline hover:underline md:inline"
              target="_blank"
            >
              /p/{project.slug}
            </Link>
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <EditorToolbar projectId={projectId} />
        <PagesLayersPanel />
        <div className="min-w-0 flex-1">
          <EditorCanvas />
        </div>
        <PropertiesPanel />
      </div>

      {versionsOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-sm border border-white/10 bg-ink-2 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="eyebrow text-neon">Historial</p>
                <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-paper">
                  Versiones
                </h3>
                <p className="mt-1 font-serif text-sm text-paper/55">
                  Snapshots manuales del documento.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full px-3 py-1.5 text-sm text-paper-muted transition hover:bg-white/5 hover:text-paper"
                onClick={() => setVersionsOpen(false)}
              >
                Cerrar
              </button>
            </div>
            <Button
              className="mb-4 w-full"
              onClick={async () => {
                await saveNow();
                await api.post(`/api/projects/${projectId}/versions`, {
                  label: `Snapshot ${new Date().toLocaleString('es-ES')}`,
                });
                await refreshVersions();
              }}
            >
              Crear versión manual
            </Button>
            <ul className="max-h-80 space-y-2 overflow-auto scrollbar-thin">
              {versions.length === 0 ? (
                <li className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-paper-muted">
                  Aún no hay versiones.
                </li>
              ) : (
                versions.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink/40 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-paper">
                        {v.label || `v${v.versionNumber}`}
                      </p>
                      <p className="text-xs text-paper-muted">
                        v{v.versionNumber} · {formatDate(v.createdAt)}
                        {v.user ? ` · ${v.user.name}` : ''}
                      </p>
                    </div>
                    <Button
                      variant="soft"
                      onClick={async () => {
                        const res = await api.post<{ document: typeof documentModel }>(
                          `/api/projects/${projectId}/versions/${v.id}/restore`,
                        );
                        useEditorStore.setState({
                          document: res.document,
                          dirty: false,
                          saveStatus: 'saved',
                          selectedIds: [],
                        });
                        await refreshVersions();
                      }}
                    >
                      Restaurar
                    </Button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

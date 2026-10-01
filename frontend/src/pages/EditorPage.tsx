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
  Play,
  RotateCw,
} from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { PagesLayersPanel } from '../components/editor/PagesLayersPanel';
import { EditorPreviewOverlay } from '../components/editor/EditorPreviewOverlay';
import { MobileEditorDock } from '../components/editor/MobileEditorDock';
import {
  StudioGuideOverlay,
  StudioHelpButton,
  useStudioGuide,
} from '../components/editor/StudioGuide';
import { ResizeHandle } from '../components/editor/ResizeHandle';
import { CollapsedRail } from '../components/editor/CollapsedRail';
import { Button, Input } from '../components/ui/primitives';
import { LAYOUT_DEFAULTS, useStudioLayout } from '../hooks/useStudioLayout';
import { useMediaQuery } from '../hooks/useMediaQuery';
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
  const actionFlash = useEditorStore((s) => s.actionFlash);
  const saveNow = useEditorStore((s) => s.saveNow);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copySelected = useEditorStore((s) => s.copySelected);
  const pasteClipboard = useEditorStore((s) => s.pasteClipboard);
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const nudgeSelected = useEditorStore((s) => s.nudgeSelected);
  const select = useEditorStore((s) => s.select);
  const documentModel = useEditorStore((s) => s.document);

  const [error, setError] = useState<string | null>(null);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const activePageId = useEditorStore((s) => s.activePageId);
  const guide = useStudioGuide();
  const layout = useStudioLayout();
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false);
  /** Phone / small tablet portrait — canvas + dock */
  const isMobilePortrait = useMediaQuery('(max-width: 900px) and (orientation: portrait)');
  /** Phone landscape — compact studio columns (more like desktop) */
  const isMobileLandscape = useMediaQuery('(max-width: 960px) and (orientation: landscape)');
  const isCompact = isMobilePortrait || isMobileLandscape;
  const [dismissRotateHint, setDismissRotateHint] = useState(false);

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
      const tag = (e.target as HTMLElement)?.tagName;
      const editingField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable;
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((meta && e.key.toLowerCase() === 'z' && e.shiftKey) || (meta && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        redo();
        return;
      }
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void saveNow();
        return;
      }
      if (meta && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setPreviewOpen(true);
        return;
      }
      if (editingField) return;

      if (meta && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copySelected();
        return;
      }
      if (meta && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteClipboard();
        return;
      }
      if (meta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }
      if (e.key === 'Escape') {
        select([]);
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudgeSelected(-step, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudgeSelected(step, 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudgeSelected(0, -step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        nudgeSelected(0, step);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    undo,
    redo,
    copySelected,
    pasteClipboard,
    duplicateSelected,
    deleteSelected,
    nudgeSelected,
    select,
    saveNow,
  ]);

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

  const saveLabel = actionFlash ? (
    <span className="text-neon">{actionFlash}</span>
  ) : saveStatus === 'saving' ? (
    <>
      <Loader2 size={12} className="animate-spin text-neon" />{' '}
      <span className="hidden sm:inline">Guardando…</span>
      <span className="sm:hidden">…</span>
    </>
  ) : saveStatus === 'saved' ? (
    <>
      <Cloud size={12} className="text-success" />{' '}
      <span className="sm:hidden">OK</span>
      <span className="hidden sm:inline">
        Guardado{lastSavedAt ? ` · ${formatDate(lastSavedAt)}` : ''}
      </span>
    </>
  ) : saveStatus === 'error' ? (
    <>
      <CloudOff size={12} className="text-danger" /> Error
    </>
  ) : (
    <span className="hidden sm:inline">Listo para editar</span>
  );

  const exportPdf = async () => {
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
  };

  const publishProject = async () => {
    setPublishing(true);
    try {
      await saveNow();
      const next = !project.published;
      const res = await api.patch<{ project: typeof project }>(`/api/projects/${projectId}`, {
        published: next,
        visibility: next ? 'public' : project.visibility,
      });
      useEditorStore.setState({ project: res.project });
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo publicar');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-ink">
      <header className="flex items-center justify-between gap-2 border-b border-white/8 bg-[#080b0f]/95 px-2 py-2 backdrop-blur-md sm:gap-3 sm:px-3 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
          <Link
            to="/app"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-paper/70 no-underline transition hover:bg-white/5 hover:text-paper"
            title="Volver al estudio"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <Input
              className="border-transparent bg-transparent px-1 py-0.5 font-display text-base font-extrabold tracking-[-0.04em] focus:border-white/15 focus:bg-ink/40 sm:text-lg"
              value={documentModel.meta.title}
              onChange={(e) => {
                useEditorStore.getState().updateDocument((doc) => ({
                  ...doc,
                  meta: { ...doc.meta, title: e.target.value },
                }));
                void api.patch(`/api/projects/${projectId}`, { title: e.target.value });
              }}
            />
            <div className="flex items-center gap-2 px-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-paper/70 sm:text-sm">
              {saveLabel}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          {!isCompact ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLayoutMenuOpen((o) => !o)}
                title="Ancho de columnas"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-ink-2/80 px-3 py-2 text-sm font-semibold text-paper/80 transition hover:border-neon/40 hover:text-paper"
              >
                Columnas
              </button>
              {layoutMenuOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/12 bg-ink-2 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <p className="px-2 pb-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-paper/50">
                    Arrastra los bordes · o elige
                  </p>
                  <button
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-paper hover:bg-ink-3"
                    onClick={() => {
                      layout.focusCanvas();
                      setLayoutMenuOpen(false);
                    }}
                  >
                    Más lienzo
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-paper hover:bg-ink-3"
                    onClick={() => {
                      layout.focusTools();
                      setLayoutMenuOpen(false);
                    }}
                  >
                    Más herramientas
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-paper hover:bg-ink-3"
                    onClick={() => {
                      layout.resetLayout();
                      setLayoutMenuOpen(false);
                    }}
                  >
                    Restablecer ({LAYOUT_DEFAULTS.tools}/{LAYOUT_DEFAULTS.layers}/
                    {LAYOUT_DEFAULTS.inspector})
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-paper hover:bg-ink-3"
                    onClick={() => {
                      layout.togglePanel('layers');
                      setLayoutMenuOpen(false);
                    }}
                  >
                    {layout.widths.layers > 0 ? 'Ocultar páginas/capas' : 'Mostrar páginas/capas'}
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-paper hover:bg-ink-3"
                    onClick={() => {
                      layout.togglePanel('inspector');
                      setLayoutMenuOpen(false);
                    }}
                  >
                    {layout.widths.inspector > 0 ? 'Ocultar inspector' : 'Mostrar inspector'}
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="hidden sm:block">
            <StudioHelpButton onClick={guide.openGuide} />
          </div>
          <Button
            variant="lima"
            className="hidden sm:inline-flex"
            onClick={() => setPreviewOpen(true)}
          >
            <Play size={15} />
            Preview
          </Button>
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
            className="px-2.5 py-2 sm:px-5 sm:py-2.5"
            disabled={exporting}
            title="PDF interactivo: CTAs y enlaces clicables fuera de PLIEGO"
            onClick={() => void exportPdf()}
          >
            <Download size={15} />
            <span className="hidden md:inline">{exporting ? 'Exportando…' : 'PDF interactivo'}</span>
          </Button>
          <Button
            variant={project.published ? 'primary' : 'soft'}
            className="px-2.5 py-2 sm:px-5 sm:py-2.5"
            disabled={publishing}
            onClick={() => void publishProject()}
          >
            <Globe size={15} />
            <span className="hidden md:inline">{project.published ? 'Publicado' : 'Publicar'}</span>
          </Button>
          {project.published ? (
            <Link
              to={`/p/${project.slug}`}
              className="hidden text-sm font-medium text-neon no-underline hover:underline md:inline"
              target="_blank"
            >
              /p/{project.slug}
            </Link>
          ) : null}
        </div>
      </header>

      {isMobilePortrait ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          {!dismissRotateHint ? (
            <div className="flex shrink-0 items-center gap-2 border-b border-neon/25 bg-neon/10 px-3 py-2">
              <RotateCw size={14} className="shrink-0 text-neon" />
              <p className="min-w-0 flex-1 font-mono text-[0.62rem] uppercase leading-snug tracking-[0.1em] text-paper/85">
                Mejor en horizontal: más lienzo y paneles como en ordenador
              </p>
              <button
                type="button"
                className="shrink-0 rounded-full px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-paper/55 hover:text-paper"
                onClick={() => setDismissRotateHint(true)}
              >
                Ok
              </button>
            </div>
          ) : null}
          <div className="relative min-h-0 flex-1">
            <EditorCanvas onOpenGuide={guide.openGuide} />
          </div>
          <MobileEditorDock projectId={projectId} />
          <StudioGuideOverlay
            open={guide.open}
            step={guide.step}
            onStep={guide.setStep}
            onClose={() => guide.setOpen(false)}
            onFinish={guide.finish}
          />
        </div>
      ) : isMobileLandscape ? (
        <div className="relative flex min-h-0 flex-1">
          <EditorToolbar projectId={projectId} width={156} />
          <div className="relative min-w-0 flex-1">
            <EditorCanvas onOpenGuide={guide.openGuide} />
          </div>
          <PropertiesPanel width={188} />
          <StudioGuideOverlay
            open={guide.open}
            step={guide.step}
            onStep={guide.setStep}
            onClose={() => guide.setOpen(false)}
            onFinish={guide.finish}
          />
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1">
          <EditorToolbar projectId={projectId} width={layout.widths.tools} />
          <ResizeHandle
            label="herramientas"
            value={layout.widths.tools}
            defaultWidth={LAYOUT_DEFAULTS.tools}
            onChange={(w) => layout.setPanelWidth('tools', w)}
          />
          {layout.widths.layers > 0 ? (
            <>
              <PagesLayersPanel width={layout.widths.layers} />
              <ResizeHandle
                label="páginas y capas"
                value={layout.widths.layers}
                defaultWidth={LAYOUT_DEFAULTS.layers}
                onChange={(w) => layout.setPanelWidth('layers', w)}
              />
            </>
          ) : (
            <CollapsedRail
              side="left"
              label="Capas"
              onExpand={() => layout.expandPanel('layers')}
            />
          )}
          <div className="relative min-w-0 flex-1">
            <EditorCanvas onOpenGuide={guide.openGuide} />
          </div>
          {layout.widths.inspector > 0 ? (
            <>
              <ResizeHandle
                label="inspector"
                value={layout.widths.inspector}
                defaultWidth={LAYOUT_DEFAULTS.inspector}
                onChange={(w) => layout.setPanelWidth('inspector', w)}
                inverted
              />
              <PropertiesPanel width={layout.widths.inspector} />
            </>
          ) : (
            <CollapsedRail
              side="right"
              label="Inspector"
              onExpand={() => layout.expandPanel('inspector')}
            />
          )}
          <StudioGuideOverlay
            open={guide.open}
            step={guide.step}
            onStep={guide.setStep}
            onClose={() => guide.setOpen(false)}
            onFinish={guide.finish}
          />
        </div>
      )}

      {previewOpen && documentModel ? (
        <EditorPreviewOverlay
          document={documentModel}
          pageId={activePageId}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}

      {versionsOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-sm border border-white/10 bg-ink-2 p-6 shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="eyebrow text-neon">Historial</p>
                <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-paper">
                  Versiones
                </h3>
                <p className="mt-1 font-serif text-sm text-paper/72">
                  Snapshots manuales del documento.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full px-3 py-1.5 text-sm text-paper/70 transition hover:bg-white/5 hover:text-paper"
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
                <li className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-paper/70">
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
                      <p className="text-sm text-paper/70">
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

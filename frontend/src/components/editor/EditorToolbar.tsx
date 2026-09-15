import { useEffect, useRef, useState } from 'react';
import {
  Type,
  Square,
  Circle,
  ImagePlus,
  MousePointer2,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Trash2,
  MousePointerClick,
  Video,
  Blend,
  Heading,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignStartVertical,
  AlignEndVertical,
  AlignEndHorizontal,
  Lock,
  Unlock,
  ChevronRight,
  Pilcrow,
} from 'lucide-react';
import { useEditorStore, type AlignMode } from '../../stores/editorStore';
import { api } from '../../services/api';
import { cn } from '../../utils/cn';

type PanelId = 'text' | 'shape' | 'align' | null;

function ToolBtn({
  title,
  active,
  onClick,
  children,
  className,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-lg text-paper-muted transition duration-150 hover:bg-ink-3 hover:text-paper',
        active && 'bg-accent-soft text-neon ring-1 ring-neon/35',
        className,
      )}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-1.5 px-0.5 text-[11px] tracking-[0.14em] text-paper-muted/70">
      {children}
    </p>
  );
}

function Flyout({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute left-full top-0 z-40 ml-2 w-52 rounded-xl border border-line bg-ink-2 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="mb-2 flex items-center justify-between px-1.5">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted">
          {title}
        </p>
        <button
          type="button"
          className="rounded px-1.5 py-0.5 text-xs text-paper-muted hover:bg-ink-3 hover:text-paper"
          onClick={onClose}
        >
          Esc
        </button>
      </div>
      {children}
    </div>
  );
}

function MenuRow({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-ink-3"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-ink-3 text-paper">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-paper">{label}</span>
        {hint ? (
          <span className="block truncate {hint}">{hint}</span>
        ) : null}
      </span>
    </button>
  );
}

export function EditorToolbar({ projectId }: { projectId: string }) {
  const [panel, setPanel] = useState<PanelId>(null);
  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const addText = useEditorStore((s) => s.addText);
  const addShape = useEditorStore((s) => s.addShape);
  const addImage = useEditorStore((s) => s.addImage);
  const addButton = useEditorStore((s) => s.addButton);
  const addVideo = useEditorStore((s) => s.addVideo);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const alignSelected = useEditorStore((s) => s.alignSelected);
  const toggleLockSelected = useEditorStore((s) => s.toggleLockSelected);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const documentModel = useEditorStore((s) => s.document);
  const activePageId = useEditorStore((s) => s.activePageId);

  const page = documentModel?.pages.find((p) => p.id === activePageId);
  const locked = page?.elements.some((e) => selectedIds.includes(e.id) && e.locked);

  const togglePanel = (id: PanelId) => setPanel((p) => (p === id ? null : id));
  const close = () => setPanel(null);

  const runAlign = (mode: AlignMode) => {
    alignSelected(mode);
  };

  return (
    <aside className="studio-rail relative flex w-[4.75rem] flex-col border-r py-3">
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-2 scrollbar-thin">
        {/* Selección */}
        <div>
          <SectionLabel>Cursor</SectionLabel>
          <div className="grid grid-cols-2 gap-1">
            <ToolBtn
              title="Seleccionar"
              active={tool === 'select' && !panel}
              onClick={() => {
                setTool('select');
                close();
              }}
            >
              <MousePointer2 size={17} strokeWidth={1.75} />
            </ToolBtn>
          </div>
        </div>

        {/* Insertar */}
        <div className="relative">
          <SectionLabel>Insertar</SectionLabel>
          <div className="grid grid-cols-2 gap-1">
            <ToolBtn
              title="Tipografía"
              active={panel === 'text'}
              onClick={() => togglePanel('text')}
            >
              <Type size={17} strokeWidth={1.75} />
            </ToolBtn>
            <ToolBtn
              title="Formas"
              active={panel === 'shape'}
              onClick={() => togglePanel('shape')}
            >
              <Square size={17} strokeWidth={1.75} />
            </ToolBtn>

            <label
              title="Imagen"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-paper-muted transition hover:bg-ink-3 hover:text-paper"
            >
              <ImagePlus size={17} strokeWidth={1.75} />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const res = await api.upload<{ asset: { url: string } }>(
                    `/api/projects/${projectId}/assets`,
                    file,
                  );
                  addImage(res.asset.url);
                  e.target.value = '';
                  close();
                }}
              />
            </label>
            <ToolBtn
              title="Botón / CTA"
              onClick={() => {
                addButton();
                close();
              }}
            >
              <MousePointerClick size={17} strokeWidth={1.75} />
            </ToolBtn>
            <ToolBtn
              title="Vídeo"
              onClick={() => {
                addVideo();
                close();
              }}
            >
              <Video size={17} strokeWidth={1.75} />
            </ToolBtn>
          </div>

          <Flyout open={panel === 'text'} title="Tipografía" onClose={close}>
            <MenuRow
              icon={<Heading size={15} />}
              label="Display"
              hint="Impacto tipográfico"
              onClick={() => {
                addText('display');
                close();
              }}
            />
            <MenuRow
              icon={<Type size={15} />}
              label="Titular"
              hint="Headline editorial"
              onClick={() => {
                addText('headline');
                close();
              }}
            />
            <MenuRow
              icon={<Pilcrow size={15} />}
              label="Cuerpo"
              hint="Párrafo de lectura"
              onClick={() => {
                addText('body');
                close();
              }}
            />
            <MenuRow
              icon={<Quote size={15} />}
              label="Cita"
              hint="Pull quote"
              onClick={() => {
                addText('quote');
                close();
              }}
            />
            <MenuRow
              icon={<AlignLeft size={15} />}
              label="Caption"
              hint="Pie / metadato"
              onClick={() => {
                addText('caption');
                close();
              }}
            />
          </Flyout>

          <Flyout open={panel === 'shape'} title="Formas" onClose={close}>
            <MenuRow
              icon={<Square size={15} />}
              label="Rectángulo"
              onClick={() => {
                addShape('rect');
                close();
              }}
            />
            <MenuRow
              icon={<Circle size={15} />}
              label="Elipse"
              onClick={() => {
                addShape('ellipse');
                close();
              }}
            />
            <MenuRow
              icon={<Blend size={15} />}
              label="Gradiente neón"
              hint="Forma con mesh de marca"
              onClick={() => {
                addShape('rect', true);
                close();
              }}
            />
          </Flyout>
        </div>

        {/* Alinear */}
        <div className="relative">
          <SectionLabel>Disposición</SectionLabel>
          <div className="grid grid-cols-2 gap-1">
            <ToolBtn
              title="Alinear y distribuir"
              active={panel === 'align'}
              onClick={() => togglePanel('align')}
              className="relative"
            >
              <AlignHorizontalJustifyCenter size={17} />
              <ChevronRight size={10} className="absolute right-0.5 top-0.5 opacity-50" />
            </ToolBtn>
            <ToolBtn title={locked ? 'Desbloquear' : 'Bloquear'} onClick={() => toggleLockSelected()}>
              {locked ? <Unlock size={16} /> : <Lock size={16} />}
            </ToolBtn>
          </div>

          <Flyout open={panel === 'align'} title="Alinear" onClose={close}>
            <p className="mb-1 px-2 font-mono text-[11px] uppercase tracking-wider text-paper-muted">
              Horizontal
            </p>
            <div className="mb-2 grid grid-cols-3 gap-1 px-1">
              <ToolBtn title="Izquierda" onClick={() => runAlign('left')}>
                <AlignLeft size={16} />
              </ToolBtn>
              <ToolBtn title="Centro X" onClick={() => runAlign('centerX')}>
                <AlignCenter size={16} />
              </ToolBtn>
              <ToolBtn title="Derecha" onClick={() => runAlign('right')}>
                <AlignRight size={16} />
              </ToolBtn>
            </div>
            <p className="mb-1 px-2 font-mono text-[11px] uppercase tracking-wider text-paper-muted">
              Vertical
            </p>
            <div className="mb-2 grid grid-cols-3 gap-1 px-1">
              <ToolBtn title="Arriba" onClick={() => runAlign('top')}>
                <AlignStartVertical size={16} />
              </ToolBtn>
              <ToolBtn title="Centro Y" onClick={() => runAlign('centerY')}>
                <AlignVerticalJustifyCenter size={16} />
              </ToolBtn>
              <ToolBtn title="Abajo" onClick={() => runAlign('bottom')}>
                <AlignEndVertical size={16} />
              </ToolBtn>
            </div>
            <p className="mb-1 px-2 font-mono text-[11px] uppercase tracking-wider text-paper-muted">
              Distribuir
            </p>
            <div className="grid grid-cols-2 gap-1 px-1">
              <ToolBtn title="Distribuir X" onClick={() => runAlign('distributeX')}>
                <AlignHorizontalJustifyCenter size={16} />
              </ToolBtn>
              <ToolBtn title="Distribuir Y" onClick={() => runAlign('distributeY')}>
                <AlignEndHorizontal size={16} />
              </ToolBtn>
            </div>
          </Flyout>
        </div>

        {/* Edición */}
        <div>
          <SectionLabel>Editar</SectionLabel>
          <div className="grid grid-cols-2 gap-1">
            <ToolBtn title="Deshacer" onClick={undo}>
              <Undo2 size={16} />
            </ToolBtn>
            <ToolBtn title="Rehacer" onClick={redo}>
              <Redo2 size={16} />
            </ToolBtn>
            <ToolBtn title="Eliminar" onClick={deleteSelected} className="hover:text-danger">
              <Trash2 size={16} />
            </ToolBtn>
          </div>
        </div>
      </div>

      {/* Zoom fijo abajo */}
      <div className="mt-2 border-t border-line px-2 pt-2">
        <SectionLabel>Zoom</SectionLabel>
        <div className="grid grid-cols-2 gap-1">
          <ToolBtn title="Acercar" onClick={() => setZoom(zoom + 0.1)}>
            <ZoomIn size={15} />
          </ToolBtn>
          <ToolBtn title="Alejar" onClick={() => setZoom(zoom - 0.1)}>
            <ZoomOut size={15} />
          </ToolBtn>
        </div>
        <button
          type="button"
          className="mt-1.5 w-full rounded-md py-1 font-mono text-xs tabular-nums text-paper-muted hover:bg-ink-3 hover:text-paper"
          onClick={() => setZoom(0.55)}
          title="Ajustar al lienzo"
        >
          {Math.round(zoom * 100)}% · Fit
        </button>
      </div>
    </aside>
  );
}

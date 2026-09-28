import { useRef, useState } from 'react';
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
  ChevronDown,
  Pilcrow,
  LayoutTemplate,
  Maximize2,
} from 'lucide-react';
import { useEditorStore, type AlignMode } from '../../stores/editorStore';
import { api } from '../../services/api';
import { cn } from '../../utils/cn';
import { EDITORIAL_BLOCKS } from '../../studio/editorialBlocks';

type PanelId = 'text' | 'shape' | 'align' | 'blocks' | null;

function ToolBtn({
  title,
  active,
  onClick,
  children,
  className,
  disabled,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'grid h-11 w-11 place-items-center rounded-xl text-paper/80 transition duration-150',
        'hover:bg-ink-3 hover:text-paper hover:ring-1 hover:ring-white/10',
        'active:scale-[0.97]',
        active && 'bg-accent-soft text-neon ring-1 ring-neon/50 shadow-[0_0_16px_rgba(79,128,255,0.2)]',
        disabled && 'pointer-events-none opacity-35',
        className,
      )}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-0.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-paper/55">
      {children}
    </p>
  );
}

function InsertRow({
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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-ink-3 hover:ring-1 hover:ring-neon/25 active:bg-ink-4"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-3 text-neon ring-1 ring-white/10">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-paper">{label}</span>
        {hint ? <span className="block truncate text-xs text-paper/55">{hint}</span> : null}
      </span>
    </button>
  );
}

function Accordion({
  id,
  openId,
  setOpenId,
  title,
  icon,
  children,
}: {
  id: PanelId;
  openId: PanelId;
  setOpenId: (id: PanelId) => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <div className="rounded-xl border border-white/8 bg-ink-2/50">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpenId(open ? null : id);
        }}
        className={cn(
          'flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition',
          open ? 'text-neon' : 'text-paper/80 hover:text-paper',
        )}
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-3">{icon}</span>
        <span className="flex-1 text-sm font-semibold">{title}</span>
        <ChevronDown
          size={16}
          className={cn('shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open ? <div className="border-t border-white/6 px-1.5 py-1.5">{children}</div> : null}
    </div>
  );
}

export function EditorToolbar({
  projectId,
  width,
}: {
  projectId: string;
  /** Omit on mobile sheets to fill the overlay. */
  width?: number;
}) {
  const [panel, setPanel] = useState<PanelId>('text');
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
  const flashAction = useEditorStore((s) => s.flashAction);
  const insertEditorialBlock = useEditorStore((s) => s.insertEditorialBlock);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const documentModel = useEditorStore((s) => s.document);
  const activePageId = useEditorStore((s) => s.activePageId);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);
  const fileRef = useRef<HTMLInputElement>(null);

  const page = documentModel?.pages.find((p) => p.id === activePageId);
  const locked = page?.elements.some((e) => selectedIds.includes(e.id) && e.locked);
  const hasSelection = selectedIds.length > 0;
  const canDistribute = selectedIds.length >= 3;

  const runAlign = (mode: AlignMode) => {
    if (!hasSelection) {
      flashAction('Selecciona un elemento');
      return;
    }
    if ((mode === 'distributeX' || mode === 'distributeY') && !canDistribute) {
      flashAction('Selecciona 3+');
      return;
    }
    alignSelected(mode);
  };

  const insert = (fn: () => void) => {
    fn();
  };

  return (
    <aside
      className="studio-rail relative z-30 flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r"
      style={{ width: width ?? '100%' }}
    >
      <div className="border-b border-white/8 px-3 py-3">
        <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-neon">
          Herramientas
        </p>
        <p className="mt-1 text-xs leading-snug text-paper/55">
          Un clic inserta en el lienzo
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-2.5 py-3 scrollbar-thin">
        <div>
          <SectionLabel>Selección</SectionLabel>
          <button
            type="button"
            onClick={() => {
              setTool('select');
              setPanel(null);
            }}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition',
              tool === 'select' && !panel
                ? 'bg-accent-soft text-neon ring-1 ring-neon/35'
                : 'text-paper/80 hover:bg-ink-3',
            )}
          >
            <MousePointer2 size={18} strokeWidth={1.75} />
            <span className="text-sm font-semibold">Seleccionar</span>
          </button>
        </div>

        <div className="space-y-2">
          <SectionLabel>Insertar</SectionLabel>

          <Accordion
            id="text"
            openId={panel}
            setOpenId={setPanel}
            title="Tipografía"
            icon={<Type size={17} />}
          >
            <InsertRow
              icon={<Heading size={16} />}
              label="Display"
              hint="Título de impacto"
              onClick={() => insert(() => addText('display'))}
            />
            <InsertRow
              icon={<Type size={16} />}
              label="Titular"
              hint="Headline editorial"
              onClick={() => insert(() => addText('headline'))}
            />
            <InsertRow
              icon={<Pilcrow size={16} />}
              label="Cuerpo"
              hint="Párrafo de lectura"
              onClick={() => insert(() => addText('body'))}
            />
            <InsertRow
              icon={<Quote size={16} />}
              label="Cita"
              hint="Pull quote"
              onClick={() => insert(() => addText('quote'))}
            />
            <InsertRow
              icon={<AlignLeft size={16} />}
              label="Caption"
              hint="Pie / metadato"
              onClick={() => insert(() => addText('caption'))}
            />
          </Accordion>

          <Accordion
            id="shape"
            openId={panel}
            setOpenId={setPanel}
            title="Formas"
            icon={<Square size={17} />}
          >
            <InsertRow
              icon={<Square size={16} />}
              label="Rectángulo"
              onClick={() => insert(() => addShape('rect'))}
            />
            <InsertRow
              icon={<Circle size={16} />}
              label="Elipse"
              onClick={() => insert(() => addShape('ellipse'))}
            />
            <InsertRow
              icon={<Blend size={16} />}
              label="Gradiente neón"
              hint="Mesh de marca PLIEGO"
              onClick={() => insert(() => addShape('rect', true))}
            />
          </Accordion>

          <Accordion
            id="blocks"
            openId={panel}
            setOpenId={setPanel}
            title="Bloques"
            icon={<LayoutTemplate size={17} />}
          >
            {EDITORIAL_BLOCKS.map((b) => (
              <InsertRow
                key={b.id}
                icon={<LayoutTemplate size={16} />}
                label={b.label}
                hint={b.hint}
                onClick={() => insert(() => insertEditorialBlock(b.id))}
              />
            ))}
          </Accordion>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-2.5 rounded-xl border border-white/8 bg-ink-2/50 px-2.5 py-2.5 text-left transition hover:border-neon/30 hover:bg-ink-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-3 text-paper">
                <ImagePlus size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-paper">Imagen</span>
                <span className="block text-xs text-paper/55">Subir archivo</span>
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  flashAction('Subiendo…');
                  const res = await api.upload<{ asset: { url: string } }>(
                    `/api/projects/${projectId}/assets`,
                    file,
                  );
                  addImage(res.asset.url);
                } catch (err) {
                  flashAction(err instanceof Error ? err.message : 'Error al subir');
                } finally {
                  e.target.value = '';
                }
              }}
            />

            <button
              type="button"
              onClick={() => insert(() => addButton())}
              className="flex w-full items-center gap-2.5 rounded-xl border border-white/8 bg-ink-2/50 px-2.5 py-2.5 text-left transition hover:border-neon/30 hover:bg-ink-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-3 text-paper">
                <MousePointerClick size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-paper">Botón / CTA</span>
                <span className="block text-xs text-paper/55">Enlaza a otra página</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const url = window.prompt(
                  'URL del vídeo (mp4 o enlace)',
                  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                );
                if (!url?.trim()) return;
                insert(() => addVideo(url.trim()));
              }}
              className="flex w-full items-center gap-2.5 rounded-xl border border-white/8 bg-ink-2/50 px-2.5 py-2.5 text-left transition hover:border-neon/30 hover:bg-ink-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-3 text-paper">
                <Video size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-paper">Vídeo</span>
                <span className="block text-xs text-paper/55">Pegar URL</span>
              </span>
            </button>
          </div>
        </div>

        <div>
          <SectionLabel>Disposición</SectionLabel>
          <Accordion
            id="align"
            openId={panel}
            setOpenId={setPanel}
            title="Alinear"
            icon={<AlignHorizontalJustifyCenter size={17} />}
          >
            <p className="mb-1 px-2 font-mono text-[0.65rem] uppercase tracking-wider text-paper/50">
              Horizontal
            </p>
            <div className="mb-2 grid grid-cols-3 gap-1 px-1">
              <ToolBtn title="Izquierda" disabled={!hasSelection} onClick={() => runAlign('left')}>
                <AlignLeft size={16} />
              </ToolBtn>
              <ToolBtn title="Centro X" disabled={!hasSelection} onClick={() => runAlign('centerX')}>
                <AlignCenter size={16} />
              </ToolBtn>
              <ToolBtn title="Derecha" disabled={!hasSelection} onClick={() => runAlign('right')}>
                <AlignRight size={16} />
              </ToolBtn>
            </div>
            <p className="mb-1 px-2 font-mono text-[0.65rem] uppercase tracking-wider text-paper/50">
              Vertical
            </p>
            <div className="mb-2 grid grid-cols-3 gap-1 px-1">
              <ToolBtn title="Arriba" disabled={!hasSelection} onClick={() => runAlign('top')}>
                <AlignStartVertical size={16} />
              </ToolBtn>
              <ToolBtn title="Centro Y" disabled={!hasSelection} onClick={() => runAlign('centerY')}>
                <AlignVerticalJustifyCenter size={16} />
              </ToolBtn>
              <ToolBtn title="Abajo" disabled={!hasSelection} onClick={() => runAlign('bottom')}>
                <AlignEndVertical size={16} />
              </ToolBtn>
            </div>
            <p className="mb-1 px-2 font-mono text-[0.65rem] uppercase tracking-wider text-paper/50">
              Distribuir
            </p>
            <div className="grid grid-cols-2 gap-1 px-1">
              <ToolBtn
                title={canDistribute ? 'Distribuir X' : 'Necesitas 3+'}
                disabled={!canDistribute}
                onClick={() => runAlign('distributeX')}
              >
                <AlignHorizontalJustifyCenter size={16} />
              </ToolBtn>
              <ToolBtn
                title={canDistribute ? 'Distribuir Y' : 'Necesitas 3+'}
                disabled={!canDistribute}
                onClick={() => runAlign('distributeY')}
              >
                <AlignEndHorizontal size={16} />
              </ToolBtn>
            </div>
          </Accordion>
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => toggleLockSelected()}
            className="mt-1.5 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-paper/75 transition hover:bg-ink-3 disabled:opacity-35"
          >
            {locked ? <Unlock size={16} /> : <Lock size={16} />}
            {locked ? 'Desbloquear' : 'Bloquear'}
          </button>
        </div>

        <div>
          <SectionLabel>Editar</SectionLabel>
          <div className="grid grid-cols-3 gap-1">
            <ToolBtn title="Deshacer · ⌘Z" disabled={past.length === 0} onClick={undo}>
              <Undo2 size={17} />
            </ToolBtn>
            <ToolBtn title="Rehacer · ⌘⇧Z" disabled={future.length === 0} onClick={redo}>
              <Redo2 size={17} />
            </ToolBtn>
            <ToolBtn title="Eliminar · ⌫" disabled={!hasSelection} onClick={deleteSelected}>
              <Trash2 size={17} />
            </ToolBtn>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 px-2.5 py-3">
        <SectionLabel>Zoom</SectionLabel>
        <div className="grid grid-cols-3 gap-1">
          <ToolBtn title="Alejar" onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}>
            <ZoomOut size={17} />
          </ToolBtn>
          <ToolBtn title="Encajar" onClick={() => setZoom(0.55)}>
            <Maximize2 size={16} />
          </ToolBtn>
          <ToolBtn title="Acercar" onClick={() => setZoom(Math.min(2.5, zoom + 0.1))}>
            <ZoomIn size={17} />
          </ToolBtn>
        </div>
        <p className="mt-2 text-center font-mono text-xs tabular-nums text-paper/50">
          {Math.round(zoom * 100)}%
        </p>
      </div>
    </aside>
  );
}

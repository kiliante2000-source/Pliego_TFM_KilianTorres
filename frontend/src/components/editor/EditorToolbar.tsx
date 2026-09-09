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
  Lock,
  Unlock,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { api } from '../../services/api';
import { cn } from '../../utils/cn';

function ToolBtn({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-lg text-paper-muted transition duration-150 hover:bg-ink-3 hover:text-paper',
        active && 'bg-accent-soft text-neon ring-1 ring-neon/35',
      )}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ projectId }: { projectId: string }) {
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

  return (
    <aside className="studio-rail flex w-14 flex-col items-center gap-1 overflow-y-auto py-3 scrollbar-thin">
      <ToolBtn title="Seleccionar" active={tool === 'select'} onClick={() => setTool('select')}>
        <MousePointer2 size={18} strokeWidth={1.75} />
      </ToolBtn>

      <div className="my-1 h-px w-7 bg-line" />
      <ToolBtn title="Titular" onClick={() => addText('headline')}>
        <Type size={18} strokeWidth={1.75} />
      </ToolBtn>
      <ToolBtn title="Display tipográfico" onClick={() => addText('display')}>
        <Heading size={18} strokeWidth={1.75} />
      </ToolBtn>
      <ToolBtn title="Cita editorial" onClick={() => addText('quote')}>
        <Quote size={18} strokeWidth={1.75} />
      </ToolBtn>
      <ToolBtn title="Cuerpo / caption" onClick={() => addText('body')}>
        <AlignLeft size={16} strokeWidth={1.75} />
      </ToolBtn>

      <div className="my-1 h-px w-7 bg-line" />
      <ToolBtn title="Rectángulo" onClick={() => addShape('rect')}>
        <Square size={18} strokeWidth={1.75} />
      </ToolBtn>
      <ToolBtn title="Elipse" onClick={() => addShape('ellipse')}>
        <Circle size={18} strokeWidth={1.75} />
      </ToolBtn>
      <ToolBtn title="Forma con gradiente" onClick={() => addShape('rect', true)}>
        <Blend size={18} strokeWidth={1.75} />
      </ToolBtn>

      <label
        title="Imagen"
        className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-paper-muted transition hover:bg-ink-3 hover:text-paper"
      >
        <ImagePlus size={18} strokeWidth={1.75} />
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
          }}
        />
      </label>
      <ToolBtn title="Botón / CTA interactivo" onClick={() => addButton()}>
        <MousePointerClick size={18} strokeWidth={1.75} />
      </ToolBtn>
      <ToolBtn title="Vídeo editorial" onClick={() => addVideo()}>
        <Video size={18} strokeWidth={1.75} />
      </ToolBtn>

      <div className="my-1 h-px w-7 bg-line" />
      <ToolBtn title="Alinear izquierda" onClick={() => alignSelected('left')}>
        <AlignLeft size={15} />
      </ToolBtn>
      <ToolBtn title="Centrar horizontal" onClick={() => alignSelected('centerX')}>
        <AlignCenter size={15} />
      </ToolBtn>
      <ToolBtn title="Alinear derecha" onClick={() => alignSelected('right')}>
        <AlignRight size={15} />
      </ToolBtn>
      <ToolBtn title="Alinear arriba" onClick={() => alignSelected('top')}>
        <AlignStartVertical size={15} />
      </ToolBtn>
      <ToolBtn title="Centrar vertical" onClick={() => alignSelected('centerY')}>
        <AlignVerticalJustifyCenter size={15} />
      </ToolBtn>
      <ToolBtn title="Alinear abajo" onClick={() => alignSelected('bottom')}>
        <AlignEndVertical size={15} />
      </ToolBtn>
      <ToolBtn title="Distribuir horizontal" onClick={() => alignSelected('distributeX')}>
        <AlignHorizontalJustifyCenter size={15} />
      </ToolBtn>

      <div className="my-1 h-px w-7 bg-line" />
      <ToolBtn title={locked ? 'Desbloquear' : 'Bloquear'} onClick={() => toggleLockSelected()}>
        {locked ? <Unlock size={16} /> : <Lock size={16} />}
      </ToolBtn>
      <ToolBtn title="Deshacer" onClick={undo}>
        <Undo2 size={16} />
      </ToolBtn>
      <ToolBtn title="Rehacer" onClick={redo}>
        <Redo2 size={16} />
      </ToolBtn>
      <ToolBtn title="Eliminar" onClick={deleteSelected}>
        <Trash2 size={16} />
      </ToolBtn>

      <div className="mt-auto flex flex-col items-center gap-1 pb-1">
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-lg text-paper-muted hover:bg-ink-3"
          onClick={() => setZoom(zoom + 0.1)}
          title="Acercar"
        >
          <ZoomIn size={15} />
        </button>
        <span className="font-mono text-[10px] tabular-nums text-paper-muted">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-lg text-paper-muted hover:bg-ink-3"
          onClick={() => setZoom(zoom - 0.1)}
          title="Alejar"
        >
          <ZoomOut size={15} />
        </button>
        <button
          type="button"
          className="mt-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-paper-muted hover:bg-ink-3 hover:text-paper"
          onClick={() => setZoom(0.55)}
        >
          Fit
        </button>
      </div>
    </aside>
  );
}

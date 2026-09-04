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
} from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { api } from '../../services/api';
import { cn } from '../../utils/cn';

export function EditorToolbar({ projectId }: { projectId: string }) {
  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const addText = useEditorStore((s) => s.addText);
  const addShape = useEditorStore((s) => s.addShape);
  const addImage = useEditorStore((s) => s.addImage);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);

  const tools = [
    { id: 'select' as const, icon: MousePointer2, label: 'Seleccionar', action: () => setTool('select') },
    { id: 'text' as const, icon: Type, label: 'Texto', action: () => addText() },
    { id: 'rect' as const, icon: Square, label: 'Rectángulo', action: () => addShape('rect') },
    { id: 'ellipse' as const, icon: Circle, label: 'Elipse', action: () => addShape('ellipse') },
  ];

  return (
    <aside className="studio-rail flex w-14 flex-col items-center gap-1.5 border-r py-3">
      {tools.map((t) => (
        <button
          key={t.id}
          type="button"
          title={t.label}
          onClick={t.action}
          className={cn(
            'grid h-10 w-10 place-items-center rounded-lg text-paper-muted transition duration-150 hover:bg-ink-3 hover:text-paper',
            tool === t.id && 'bg-accent-soft text-accent ring-1 ring-accent/30',
          )}
        >
          <t.icon size={18} strokeWidth={1.75} />
        </button>
      ))}
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
      <div className="my-2 h-px w-7 bg-line" />
      <button
        type="button"
        title="Deshacer"
        className="grid h-9 w-9 place-items-center rounded-lg text-paper-muted hover:bg-ink-3 hover:text-paper"
        onClick={undo}
      >
        <Undo2 size={16} />
      </button>
      <button
        type="button"
        title="Rehacer"
        className="grid h-9 w-9 place-items-center rounded-lg text-paper-muted hover:bg-ink-3 hover:text-paper"
        onClick={redo}
      >
        <Redo2 size={16} />
      </button>
      <button
        type="button"
        title="Eliminar"
        className="grid h-9 w-9 place-items-center rounded-lg text-paper-muted hover:bg-danger/15 hover:text-danger"
        onClick={deleteSelected}
      >
        <Trash2 size={16} />
      </button>
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

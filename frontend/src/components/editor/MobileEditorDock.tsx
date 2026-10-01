import { useRef, useState } from 'react';
import {
  ImagePlus,
  Layers,
  MousePointer2,
  MousePointerClick,
  Redo2,
  SlidersHorizontal,
  Square,
  Trash2,
  Type,
  Undo2,
  Copy,
} from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { PagesLayersPanel } from './PagesLayersPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { api } from '../../services/api';
import { cn } from '../../utils/cn';

type Sheet = 'none' | 'layers' | 'props' | 'text' | 'shape';

function DockBtn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl transition',
        active ? 'bg-neon/20 text-neon ring-1 ring-neon/40' : 'text-paper/75 hover:bg-white/5 hover:text-paper',
        disabled && 'opacity-35',
      )}
    >
      {children}
    </button>
  );
}

/**
 * Mobile editing chrome: canvas stays primary; key tools live in a compact dock.
 * Sheets open to ~42vh so the project remains visible above.
 */
export function MobileEditorDock({ projectId }: { projectId: string }) {
  const [sheet, setSheet] = useState<Sheet>('none');
  const fileRef = useRef<HTMLInputElement>(null);

  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const addText = useEditorStore((s) => s.addText);
  const addShape = useEditorStore((s) => s.addShape);
  const addImage = useEditorStore((s) => s.addImage);
  const addButton = useEditorStore((s) => s.addButton);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const deleteSelected = useEditorStore((s) => s.deleteSelected);
  const duplicateSelected = useEditorStore((s) => s.duplicateSelected);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const past = useEditorStore((s) => s.past);
  const future = useEditorStore((s) => s.future);
  const flashAction = useEditorStore((s) => s.flashAction);

  const hasSelection = selectedIds.length > 0;

  const toggleSheet = (next: Sheet) => {
    setSheet((cur) => (cur === next ? 'none' : next));
  };

  return (
    <div className="relative shrink-0">
      {sheet !== 'none' ? (
        <div className="absolute inset-x-0 bottom-full z-40 mb-2 flex max-h-[42vh] flex-col justify-end px-2">
          <div className="overflow-hidden rounded-2xl border border-white/12 bg-ink shadow-[0_-16px_50px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper/55">
                {sheet === 'layers'
                  ? 'Páginas y capas'
                  : sheet === 'props'
                    ? 'Propiedades'
                    : sheet === 'text'
                      ? 'Tipografía'
                      : 'Formas'}
              </p>
              <button
                type="button"
                className="rounded-full px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-paper/55 hover:text-paper"
                onClick={() => setSheet('none')}
              >
                Cerrar
              </button>
            </div>
            <div className="max-h-[36vh] overflow-y-auto overscroll-contain">
              {sheet === 'layers' ? <PagesLayersPanel /> : null}
              {sheet === 'props' ? <PropertiesPanel /> : null}
              {sheet === 'text' ? (
                <div className="grid grid-cols-2 gap-2 p-3">
                  {(
                    [
                      ['display', 'Display'],
                      ['headline', 'Titular'],
                      ['body', 'Cuerpo'],
                      ['quote', 'Cita'],
                      ['caption', 'Caption'],
                    ] as const
                  ).map(([kind, label]) => (
                    <button
                      key={kind}
                      type="button"
                      className="rounded-xl border border-white/10 bg-ink-2/70 px-3 py-3 text-left text-sm font-semibold text-paper hover:border-neon/35"
                      onClick={() => {
                        addText(kind);
                        setSheet('none');
                        setTool('select');
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}
              {sheet === 'shape' ? (
                <div className="grid grid-cols-2 gap-2 p-3">
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-ink-2/70 px-3 py-3 text-left text-sm font-semibold text-paper hover:border-neon/35"
                    onClick={() => {
                      addShape('rect');
                      setSheet('none');
                      setTool('select');
                    }}
                  >
                    Rectángulo
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-ink-2/70 px-3 py-3 text-left text-sm font-semibold text-paper hover:border-neon/35"
                    onClick={() => {
                      addShape('ellipse');
                      setSheet('none');
                      setTool('select');
                    }}
                  >
                    Elipse
                  </button>
                  <button
                    type="button"
                    className="col-span-2 rounded-xl border border-white/10 bg-ink-2/70 px-3 py-3 text-left text-sm font-semibold text-paper hover:border-neon/35"
                    onClick={() => {
                      addShape('rect', true);
                      setSheet('none');
                      setTool('select');
                    }}
                  >
                    Gradiente neón
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10 bg-[#080b0f]/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 scrollbar-thin">
          <DockBtn
            label="Seleccionar"
            active={tool === 'select' && sheet === 'none'}
            onClick={() => {
              setTool('select');
              setSheet('none');
            }}
          >
            <MousePointer2 size={18} />
          </DockBtn>
          <DockBtn label="Texto" active={sheet === 'text'} onClick={() => toggleSheet('text')}>
            <Type size={18} />
          </DockBtn>
          <DockBtn label="Formas" active={sheet === 'shape'} onClick={() => toggleSheet('shape')}>
            <Square size={18} />
          </DockBtn>
          <DockBtn
            label="Imagen"
            onClick={() => {
              setSheet('none');
              fileRef.current?.click();
            }}
          >
            <ImagePlus size={18} />
          </DockBtn>
          <DockBtn
            label="Botón CTA"
            onClick={() => {
              addButton();
              setSheet('none');
              setTool('select');
            }}
          >
            <MousePointerClick size={18} />
          </DockBtn>
          <span className="mx-1 h-7 w-px shrink-0 bg-white/10" aria-hidden />
          <DockBtn label="Deshacer" disabled={past.length === 0} onClick={() => undo()}>
            <Undo2 size={18} />
          </DockBtn>
          <DockBtn label="Rehacer" disabled={future.length === 0} onClick={() => redo()}>
            <Redo2 size={18} />
          </DockBtn>
          <DockBtn
            label="Duplicar"
            disabled={!hasSelection}
            onClick={() => duplicateSelected()}
          >
            <Copy size={17} />
          </DockBtn>
          <DockBtn
            label="Eliminar"
            disabled={!hasSelection}
            onClick={() => deleteSelected()}
          >
            <Trash2 size={18} />
          </DockBtn>
          <span className="mx-1 h-7 w-px shrink-0 bg-white/10" aria-hidden />
          <DockBtn label="Capas" active={sheet === 'layers'} onClick={() => toggleSheet('layers')}>
            <Layers size={18} />
          </DockBtn>
          <DockBtn label="Props" active={sheet === 'props'} onClick={() => toggleSheet('props')}>
            <SlidersHorizontal size={18} />
          </DockBtn>
        </div>
      </div>

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
            setTool('select');
          } catch (err) {
            flashAction(err instanceof Error ? err.message : 'Error al subir');
          } finally {
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}

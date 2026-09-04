import { useEditorStore } from '../../stores/editorStore';
import { getActivePage } from '../../utils/document';
import { Input, Select, Textarea } from '../ui/primitives';
import type { CanvasElement, TextElement } from '../../types/document';

export function PropertiesPanel() {
  const documentModel = useEditorStore((s) => s.document);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateSelected = useEditorStore((s) => s.updateSelected);
  const setBackground = useEditorStore((s) => s.setBackground);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);

  if (!documentModel) return null;
  const page = getActivePage(documentModel, activePageId);
  const selected = page?.elements.filter((el) => selectedIds.includes(el.id)) ?? [];
  const el = selected[0] as CanvasElement | undefined;

  return (
    <aside className="studio-rail flex w-72 flex-col border-l">
      <div className="border-b border-line px-4 py-3.5">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper-muted">
          Propiedades
        </h2>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4 scrollbar-thin">
        {!el ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-paper">Página activa</p>
            <Input
              label="Fondo"
              type="color"
              value={page?.background.fill || '#ffffff'}
              onChange={(e) => setBackground(e.target.value)}
            />
            <p className="text-xs leading-relaxed text-paper-muted">
              Selecciona un elemento en el lienzo o en Capas para editar tipografía, posición y estilo.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="X"
                type="number"
                value={Math.round(el.x)}
                onChange={(e) => updateSelected({ x: Number(e.target.value) })}
              />
              <Input
                label="Y"
                type="number"
                value={Math.round(el.y)}
                onChange={(e) => updateSelected({ y: Number(e.target.value) })}
              />
              <Input
                label="Ancho"
                type="number"
                value={Math.round(el.width)}
                onChange={(e) => updateSelected({ width: Number(e.target.value) })}
              />
              <Input
                label="Alto"
                type="number"
                value={Math.round(el.height)}
                onChange={(e) => updateSelected({ height: Number(e.target.value) })}
              />
              <Input
                label="Rotación"
                type="number"
                value={Math.round(el.rotation)}
                onChange={(e) => updateSelected({ rotation: Number(e.target.value) })}
              />
              <Input
                label="Opacidad"
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={el.opacity}
                onChange={(e) => updateSelected({ opacity: Number(e.target.value) })}
              />
            </div>

            {el.type === 'text' ? <TextProps el={el} /> : null}

            {el.type === 'shape' ? (
              <Input
                label="Relleno"
                type="color"
                value={el.fill}
                onChange={(e) => updateSelected({ fill: e.target.value } as Partial<CanvasElement>)}
              />
            ) : null}

            {el.type === 'image' ? (
              <Input
                label="URL imagen"
                value={el.src}
                onChange={(e) => updateSelected({ src: e.target.value } as Partial<CanvasElement>)}
              />
            ) : null}

            <div className="flex gap-2">
              <button
                className="flex-1 rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line"
                onClick={bringForward}
              >
                Traer adelante
              </button>
              <button
                className="flex-1 rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line"
                onClick={sendBackward}
              >
                Enviar atrás
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function TextProps({ el }: { el: TextElement }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  return (
    <div className="space-y-3">
      <Textarea
        label="Contenido"
        value={el.text}
        onChange={(e) =>
          updateSelected((item) =>
            item.type === 'text' ? { ...item, text: e.target.value } : item,
          )
        }
      />
      <Select
        label="Fuente"
        value={el.style.fontFamily}
        onChange={(e) =>
          updateSelected((item) =>
            item.type === 'text'
              ? { ...item, style: { ...item.style, fontFamily: e.target.value } }
              : item,
          )
        }
      >
        <option value="Fraunces">Fraunces</option>
        <option value="Manrope">Manrope</option>
        <option value="Georgia">Georgia</option>
        <option value="Arial">Arial</option>
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Tamaño"
          type="number"
          value={el.style.fontSize}
          onChange={(e) =>
            updateSelected((item) =>
              item.type === 'text'
                ? { ...item, style: { ...item.style, fontSize: Number(e.target.value) } }
                : item,
            )
          }
        />
        <Select
          label="Peso"
          value={String(el.style.fontWeight)}
          onChange={(e) =>
            updateSelected((item) =>
              item.type === 'text'
                ? { ...item, style: { ...item.style, fontWeight: e.target.value } }
                : item,
            )
          }
        >
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
        </Select>
      </div>
      <Input
        label="Color"
        type="color"
        value={el.style.color}
        onChange={(e) =>
          updateSelected((item) =>
            item.type === 'text'
              ? { ...item, style: { ...item.style, color: e.target.value } }
              : item,
          )
        }
      />
      <Select
        label="Alineación"
        value={el.style.align}
        onChange={(e) =>
          updateSelected((item) =>
            item.type === 'text'
              ? {
                  ...item,
                  style: {
                    ...item.style,
                    align: e.target.value as TextElement['style']['align'],
                  },
                }
              : item,
          )
        }
      >
        <option value="left">Izquierda</option>
        <option value="center">Centro</option>
        <option value="right">Derecha</option>
      </Select>
    </div>
  );
}

import { useEditorStore } from '../../stores/editorStore';
import { getActivePage } from '../../utils/document';
import { Input, Select, Textarea } from '../ui/primitives';
import {
  ANIMATION_PRESETS,
  FONT_OPTIONS,
  type ButtonElement,
  type CanvasElement,
  type ElementAnimation,
  type ElementEffects,
  type ImageElement,
  type ShapeElement,
  type TextElement,
  type VideoElement,
} from '../../types/document';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5 border-b border-line/70 pb-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PropertiesPanel() {
  const documentModel = useEditorStore((s) => s.document);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const updateSelected = useEditorStore((s) => s.updateSelected);
  const setBackground = useEditorStore((s) => s.setBackground);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const toggleLockSelected = useEditorStore((s) => s.toggleLockSelected);
  const addText = useEditorStore((s) => s.addText);
  const addButton = useEditorStore((s) => s.addButton);
  const addShape = useEditorStore((s) => s.addShape);

  if (!documentModel) return null;
  const page = getActivePage(documentModel, activePageId);
  const selected = page?.elements.filter((el) => selectedIds.includes(el.id)) ?? [];
  const el = selected[0] as CanvasElement | undefined;

  return (
    <aside className="studio-rail flex w-[300px] flex-col border-l">
      <div className="border-b border-line px-4 py-3.5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted">
          Inspector
        </h2>
        <p className="mt-1 text-xs text-paper-muted/80">
          Tipografía · efectos · motion · links
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4 scrollbar-thin">
        {!el ? (
          <div className="space-y-4">
            <Section title="Página">
              <Input
                label="Fondo"
                type="color"
                value={page?.background.fill || '#ffffff'}
                onChange={(e) => setBackground(e.target.value)}
              />
              <p className="text-xs leading-relaxed text-paper-muted">
                Lienzo {documentModel.meta.width}×{documentModel.meta.height}. Selecciona capas o
                inserta bloques creativos.
              </p>
            </Section>
            <Section title="Bloques rápidos">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Display', fn: () => addText('display') },
                  { label: 'Titular', fn: () => addText('headline') },
                  { label: 'Cuerpo', fn: () => addText('body') },
                  { label: 'Cita', fn: () => addText('quote') },
                  { label: 'Caption', fn: () => addText('caption') },
                  { label: 'CTA', fn: () => addButton() },
                  { label: 'Gradiente', fn: () => addShape('rect', true) },
                  { label: 'Elipse', fn: () => addShape('ellipse') },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={b.fn}
                    className="rounded-lg bg-ink-3 px-2 py-2 text-left text-xs font-medium text-paper transition hover:bg-ink-4 hover:ring-1 hover:ring-neon/30"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </Section>
          </div>
        ) : (
          <>
            <Section title="Capa">
              <Input
                label="Nombre"
                value={el.name ?? ''}
                placeholder={el.type}
                onChange={(e) => updateSelected({ name: e.target.value })}
              />
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
              <button
                type="button"
                className="w-full rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line"
                onClick={toggleLockSelected}
              >
                {el.locked ? 'Desbloquear capa' : 'Bloquear capa'}
              </button>
            </Section>

            {el.type === 'text' ? <TextProps el={el} /> : null}
            {el.type === 'shape' ? <ShapeProps el={el} /> : null}
            {el.type === 'image' ? <ImageProps el={el} /> : null}
            {el.type === 'button' ? <ButtonProps el={el} /> : null}
            {el.type === 'video' ? <VideoProps el={el} /> : null}

            <EffectsProps effects={el.effects} />
            <AnimationProps animation={el.animation} />
            <InteractionProps el={el} />

            <Section title="Orden">
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line" onClick={bringForward}>
                  Adelante
                </button>
                <button className="rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line" onClick={sendBackward}>
                  Atrás
                </button>
                <button className="rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line" onClick={bringToFront}>
                  Al frente
                </button>
                <button className="rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line" onClick={sendToBack}>
                  Al fondo
                </button>
              </div>
            </Section>
          </>
        )}
      </div>
    </aside>
  );
}

function TextProps({ el }: { el: TextElement }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  const patchStyle = (patch: Partial<TextElement['style']>) =>
    updateSelected((item) =>
      item.type === 'text' ? { ...item, style: { ...item.style, ...patch } } : item,
    );

  return (
    <Section title="Tipografía">
      <Textarea
        label="Contenido"
        value={el.text}
        rows={4}
        onChange={(e) =>
          updateSelected((item) =>
            item.type === 'text' ? { ...item, text: e.target.value } : item,
          )
        }
      />
      <Select label="Fuente" value={el.style.fontFamily} onChange={(e) => patchStyle({ fontFamily: e.target.value })}>
        {FONT_OPTIONS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Tamaño"
          type="number"
          value={el.style.fontSize}
          onChange={(e) => patchStyle({ fontSize: Number(e.target.value) })}
        />
        <Select
          label="Peso"
          value={String(el.style.fontWeight)}
          onChange={(e) => patchStyle({ fontWeight: e.target.value })}
        >
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
          <option value="800">Black</option>
        </Select>
        <Input
          label="Interlineado"
          type="number"
          step={0.05}
          value={el.style.lineHeight ?? 1.2}
          onChange={(e) => patchStyle({ lineHeight: Number(e.target.value) })}
        />
        <Input
          label="Tracking"
          type="number"
          step={0.5}
          value={el.style.letterSpacing ?? 0}
          onChange={(e) => patchStyle({ letterSpacing: Number(e.target.value) })}
        />
      </div>
      <Input label="Color" type="color" value={el.style.color} onChange={(e) => patchStyle({ color: e.target.value })} />
      <Select
        label="Alineación"
        value={el.style.align}
        onChange={(e) => patchStyle({ align: e.target.value as TextElement['style']['align'] })}
      >
        <option value="left">Izquierda</option>
        <option value="center">Centro</option>
        <option value="right">Derecha</option>
        <option value="justify">Justificado</option>
      </Select>
      <Select
        label="Transformación"
        value={el.style.textTransform ?? 'none'}
        onChange={(e) =>
          patchStyle({
            textTransform: e.target.value as TextElement['style']['textTransform'],
          })
        }
      >
        <option value="none">Ninguna</option>
        <option value="uppercase">Mayúsculas</option>
        <option value="lowercase">Minúsculas</option>
        <option value="capitalize">Capitalizar</option>
      </Select>
      <div className="flex gap-2">
        <button
          type="button"
          className={`flex-1 rounded-md px-2 py-2 text-xs ${el.style.italic ? 'bg-accent-soft text-neon' : 'bg-ink-3 text-paper'}`}
          onClick={() => patchStyle({ italic: !el.style.italic })}
        >
          Itálica
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md px-2 py-2 text-xs ${el.style.underline ? 'bg-accent-soft text-neon' : 'bg-ink-3 text-paper'}`}
          onClick={() => patchStyle({ underline: !el.style.underline })}
        >
          Subrayado
        </button>
      </div>
    </Section>
  );
}

function ShapeProps({ el }: { el: ShapeElement }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  return (
    <Section title="Forma">
      <Input
        label="Relleno"
        type="color"
        value={el.fill}
        onChange={(e) => updateSelected({ fill: e.target.value } as Partial<CanvasElement>)}
      />
      <Input
        label="Borde"
        type="color"
        value={el.stroke ?? '#000000'}
        onChange={(e) => updateSelected({ stroke: e.target.value } as Partial<CanvasElement>)}
      />
      <Input
        label="Grosor borde"
        type="number"
        value={el.strokeWidth ?? 0}
        onChange={(e) =>
          updateSelected({ strokeWidth: Number(e.target.value) } as Partial<CanvasElement>)
        }
      />
      {el.shape === 'rect' ? (
        <Input
          label="Radio esquina"
          type="number"
          value={el.cornerRadius ?? 0}
          onChange={(e) =>
            updateSelected({ cornerRadius: Number(e.target.value) } as Partial<CanvasElement>)
          }
        />
      ) : null}
      <button
        type="button"
        className="w-full rounded-md bg-ink-3 px-2 py-2 text-xs text-paper hover:bg-line"
        onClick={() =>
          updateSelected((item) =>
            item.type === 'shape'
              ? {
                  ...item,
                  fillGradient: item.fillGradient
                    ? undefined
                    : {
                        type: 'linear',
                        angle: 135,
                        stops: [
                          { offset: 0, color: '#4F80FF' },
                          { offset: 0.25, color: '#FF4EDB' },
                          { offset: 0.5, color: '#A855F7' },
                          { offset: 0.75, color: '#B2FF3A' },
                          { offset: 1, color: '#FF7A45' },
                        ],
                      },
                }
              : item,
          )
        }
      >
        {el.fillGradient ? (
          'Quitar gradiente'
        ) : (
          <>
            Aplicar gradiente <span className="notranslate" lang="es" translate="no">PLIEGO</span>
          </>
        )}
      </button>
      {el.fillGradient ? (
        <Input
          label="Ángulo gradiente"
          type="number"
          value={el.fillGradient.angle ?? 135}
          onChange={(e) =>
            updateSelected((item) =>
              item.type === 'shape' && item.fillGradient
                ? {
                    ...item,
                    fillGradient: { ...item.fillGradient, angle: Number(e.target.value) },
                  }
                : item,
            )
          }
        />
      ) : null}
    </Section>
  );
}

function ImageProps({ el }: { el: ImageElement }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  return (
    <Section title="Imagen">
      <Input
        label="URL"
        value={el.src}
        onChange={(e) => updateSelected({ src: e.target.value } as Partial<CanvasElement>)}
      />
      <Select
        label="Ajuste"
        value={el.fit ?? 'cover'}
        onChange={(e) =>
          updateSelected({
            fit: e.target.value as ImageElement['fit'],
          } as Partial<CanvasElement>)
        }
      >
        <option value="cover">Cover</option>
        <option value="contain">Contain</option>
        <option value="fill">Fill</option>
      </Select>
      <Input
        label="Radio"
        type="number"
        value={el.cornerRadius ?? 0}
        onChange={(e) =>
          updateSelected({ cornerRadius: Number(e.target.value) } as Partial<CanvasElement>)
        }
      />
    </Section>
  );
}

function ButtonProps({ el }: { el: ButtonElement }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  return (
    <Section title="Botón / CTA">
      <Input
        label="Etiqueta"
        value={el.label}
        onChange={(e) => updateSelected({ label: e.target.value } as Partial<CanvasElement>)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Fondo"
          type="color"
          value={el.fill}
          onChange={(e) => updateSelected({ fill: e.target.value } as Partial<CanvasElement>)}
        />
        <Input
          label="Texto"
          type="color"
          value={el.textColor}
          onChange={(e) => updateSelected({ textColor: e.target.value } as Partial<CanvasElement>)}
        />
        <Input
          label="Tamaño"
          type="number"
          value={el.fontSize ?? 16}
          onChange={(e) =>
            updateSelected({ fontSize: Number(e.target.value) } as Partial<CanvasElement>)
          }
        />
        <Input
          label="Radio"
          type="number"
          value={el.cornerRadius ?? 0}
          onChange={(e) =>
            updateSelected({ cornerRadius: Number(e.target.value) } as Partial<CanvasElement>)
          }
        />
      </div>
    </Section>
  );
}

function VideoProps({ el }: { el: VideoElement }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  return (
    <Section title="Vídeo">
      <Input
        label="URL MP4 / stream"
        value={el.src}
        onChange={(e) => updateSelected({ src: e.target.value } as Partial<CanvasElement>)}
      />
      <Input
        label="Poster"
        value={el.poster ?? ''}
        onChange={(e) => updateSelected({ poster: e.target.value } as Partial<CanvasElement>)}
      />
      <div className="flex gap-2">
        {(['autoplay', 'loop', 'muted'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={`flex-1 rounded-md px-2 py-2 text-[11px] uppercase ${el[key] ? 'bg-accent-soft text-neon' : 'bg-ink-3 text-paper'}`}
            onClick={() => updateSelected({ [key]: !el[key] } as Partial<CanvasElement>)}
          >
            {key}
          </button>
        ))}
      </div>
    </Section>
  );
}

function EffectsProps({ effects }: { effects?: ElementEffects }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  const e = effects ?? {};
  const patch = (patch: Partial<ElementEffects>) =>
    updateSelected((item) => ({
      ...item,
      effects: { ...item.effects, ...patch },
    }));

  return (
    <Section title="Efectos">
      <Input
        label="Blur"
        type="number"
        min={0}
        max={40}
        value={e.blur ?? 0}
        onChange={(ev) => patch({ blur: Number(ev.target.value) })}
      />
      <Input
        label="Sombra blur"
        type="number"
        value={e.shadowBlur ?? 0}
        onChange={(ev) => patch({ shadowBlur: Number(ev.target.value) })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Sombra X"
          type="number"
          value={e.shadowOffsetX ?? 0}
          onChange={(ev) => patch({ shadowOffsetX: Number(ev.target.value) })}
        />
        <Input
          label="Sombra Y"
          type="number"
          value={e.shadowOffsetY ?? 0}
          onChange={(ev) => patch({ shadowOffsetY: Number(ev.target.value) })}
        />
      </div>
      <Input
        label="Color sombra"
        type="color"
        value={e.shadowColor ?? '#000000'}
        onChange={(ev) => patch({ shadowColor: ev.target.value })}
      />
      <Select
        label="Blend mode"
        value={e.blendMode ?? 'normal'}
        onChange={(ev) => patch({ blendMode: ev.target.value as ElementEffects['blendMode'] })}
      >
        <option value="normal">Normal</option>
        <option value="multiply">Multiply</option>
        <option value="screen">Screen</option>
        <option value="overlay">Overlay</option>
        <option value="difference">Difference</option>
        <option value="soft-light">Soft light</option>
      </Select>
    </Section>
  );
}

function AnimationProps({ animation }: { animation?: ElementAnimation }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  const a = animation ?? { preset: 'none' as const };
  const patch = (patch: Partial<ElementAnimation>) =>
    updateSelected((item) => ({
      ...item,
      animation: { preset: 'none', ...item.animation, ...patch },
    }));

  return (
    <Section title="Motion (publicación)">
      <Select
        label="Preset"
        value={a.preset}
        onChange={(e) => patch({ preset: e.target.value as ElementAnimation['preset'] })}
      >
        {ANIMATION_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Duración ms"
          type="number"
          value={a.duration ?? 700}
          onChange={(e) => patch({ duration: Number(e.target.value) })}
        />
        <Input
          label="Delay ms"
          type="number"
          value={a.delay ?? 0}
          onChange={(e) => patch({ delay: Number(e.target.value) })}
        />
      </div>
      <Select
        label="Trigger"
        value={a.trigger ?? 'load'}
        onChange={(e) => patch({ trigger: e.target.value as ElementAnimation['trigger'] })}
      >
        <option value="load">Al cargar</option>
        <option value="scroll">Al hacer scroll</option>
        <option value="hover">Hover</option>
      </Select>
    </Section>
  );
}

function InteractionProps({ el }: { el: CanvasElement }) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  const i = el.interaction ?? {};
  return (
    <Section title="Interacción">
      <Input
        label="Enlace (href)"
        value={i.href ?? ''}
        placeholder="https://…"
        onChange={(e) =>
          updateSelected((item) => ({
            ...item,
            interaction: { ...item.interaction, href: e.target.value },
          }))
        }
      />
      <Select
        label="Target"
        value={i.target ?? '_blank'}
        onChange={(e) =>
          updateSelected((item) => ({
            ...item,
            interaction: {
              ...item.interaction,
              target: e.target.value as '_self' | '_blank',
            },
          }))
        }
      >
        <option value="_blank">Nueva pestaña</option>
        <option value="_self">Misma pestaña</option>
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Hover scale"
          type="number"
          step={0.01}
          value={i.hoverScale ?? 1}
          onChange={(e) =>
            updateSelected((item) => ({
              ...item,
              interaction: { ...item.interaction, hoverScale: Number(e.target.value) },
            }))
          }
        />
        <Input
          label="Hover opacity"
          type="number"
          step={0.05}
          value={i.hoverOpacity ?? 1}
          onChange={(e) =>
            updateSelected((item) => ({
              ...item,
              interaction: { ...item.interaction, hoverOpacity: Number(e.target.value) },
            }))
          }
        />
      </div>
    </Section>
  );
}

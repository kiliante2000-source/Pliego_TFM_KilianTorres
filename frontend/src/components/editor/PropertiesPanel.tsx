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
import { ARTBOARD_PRESETS, BRAND_SWATCHES, PLIEGO_BRAND } from '../../brand/pliegoBrand';
import { EDITORIAL_BLOCKS } from '../../studio/editorialBlocks';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5 border-b border-line/70 pb-4">
      <h3 className="text-base font-semibold uppercase tracking-[0.14em] text-paper/70">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PropertiesPanel({ width = 300 }: { width?: number }) {
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
  const applyBrandToSelection = useEditorStore((s) => s.applyBrandToSelection);
  const insertEditorialBlock = useEditorStore((s) => s.insertEditorialBlock);
  const setArtboardSize = useEditorStore((s) => s.setArtboardSize);

  if (!documentModel) return null;
  const page = getActivePage(documentModel, activePageId);
  const selected = page?.elements.filter((el) => selectedIds.includes(el.id)) ?? [];
  const el = selected[0] as CanvasElement | undefined;

  return (
    <aside className="studio-rail flex shrink-0 flex-col overflow-hidden border-l" style={{ width }}>
      <div className="border-b border-line px-4 py-3.5">
        <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-paper/70">
          Inspector
        </h2>
        <p className="mt-1 text-base text-paper/80">
          {el
            ? 'Propiedades de la selección'
            : 'Sin selección · inserta o elige una capa'}
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4 scrollbar-thin">
        {!el ? (
          <div className="space-y-4">
            <Section title="Cómo crear">
              <ol className="space-y-2 text-sm leading-relaxed text-paper/75">
                <li>
                  <span className="font-semibold text-paper">1.</span> Barra izquierda → Insertar
                  (T, formas, bloques).
                </li>
                <li>
                  <span className="font-semibold text-paper">2.</span> Clic en el lienzo para
                  seleccionar; doble clic edita texto.
                </li>
                <li>
                  <span className="font-semibold text-paper">3.</span> Motion aquí abajo → Preview
                  (⌘P) para ver animación.
                </li>
              </ol>
            </Section>
            <Section title="Página">
              <Input
                label="Fondo"
                type="color"
                value={page?.background.fill || '#ffffff'}
                onChange={(e) => setBackground(e.target.value)}
              />
              <p className="text-base leading-relaxed text-paper/80">
                Lienzo {documentModel.meta.width}×{documentModel.meta.height}.
              </p>
            </Section>
            <Section title="Kit de marca">
              <p className="text-base leading-relaxed text-paper/80">
                Sin selección aplica el acento a toda la página. Con capas elegidas, solo a ellas.
              </p>
              <div className="flex flex-wrap gap-2">
                {BRAND_SWATCHES.filter((s) => !['paper', 'ink'].includes(s.id)).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    title={s.label}
                    className="h-8 w-8 rounded-full border border-white/20 transition hover:scale-110"
                    style={{ background: s.color, boxShadow: `0 0 12px ${s.color}66` }}
                    onClick={() => applyBrandToSelection(s.color)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-ink-3 px-3 py-2 text-left text-base font-medium text-paper transition hover:bg-ink-4 hover:ring-1 hover:ring-neon/30"
                onClick={() => applyBrandToSelection(PLIEGO_BRAND.neon)}
              >
                Aplicar marca a toda la página
              </button>
            </Section>
            <Section title="Bloques editoriales">
              <div className="grid gap-2">
                {EDITORIAL_BLOCKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className="rounded-lg bg-ink-3 px-3 py-2 text-left transition hover:bg-ink-4 hover:ring-1 hover:ring-neon/30"
                    onClick={() => insertEditorialBlock(b.id)}
                  >
                    <span className="block text-base font-semibold text-paper">{b.label}</span>
                    <span className="block text-sm text-paper/65">{b.hint}</span>
                  </button>
                ))}
              </div>
            </Section>
            <Section title="Formato artboard">
              <div className="grid gap-1.5">
                {ARTBOARD_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-base transition hover:bg-ink-3"
                    onClick={() => setArtboardSize(p.width, p.height, p.orientation)}
                  >
                    <span className="font-medium text-paper">{p.label}</span>
                    <span className="font-mono text-sm tabular-nums text-paper/60">
                      {p.width}×{p.height}
                    </span>
                  </button>
                ))}
              </div>
            </Section>
            <Section title="Atajos del estudio">
              <ul className="space-y-1.5 font-mono text-sm text-paper/70">
                <li>⌘P — Preview con motion</li>
                <li>⌘Z / ⌘⇧Z — deshacer / rehacer</li>
                <li>⌘C · ⌘V · ⌘D — copiar / pegar / duplicar</li>
                <li>⌘S — guardar · ⌫ — eliminar</li>
                <li>Flechas — mover · ⇧ flechas — 10px</li>
                <li>Doble clic — editar texto en canvas</li>
                <li>Esc — deseleccionar</li>
              </ul>
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
                    className="rounded-lg bg-ink-3 px-2 py-2 text-left text-sm font-medium text-paper transition hover:bg-ink-4 hover:ring-1 hover:ring-neon/30"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </Section>
          </div>
        ) : (
          <>
            <Section title="Kit de marca">
              <p className="text-sm text-paper/65">Aplica color PLIEGO a la selección.</p>
              <div className="flex flex-wrap gap-2">
                {BRAND_SWATCHES.filter((s) => !['paper', 'ink'].includes(s.id)).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    title={`Aplicar ${s.label}`}
                    className="h-7 w-7 rounded-full border border-white/20 transition hover:scale-110"
                    style={{ background: s.color }}
                    onClick={() => applyBrandToSelection(s.color)}
                  />
                ))}
              </div>
            </Section>
            <AnimationProps animation={el.animation} highlight />
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
                <Input
                  label="Escala %"
                  type="number"
                  min={10}
                  max={400}
                  step={1}
                  value={Math.round(((el.scaleX + el.scaleY) / 2) * 100)}
                  onChange={(e) => {
                    const s = Math.max(0.1, Number(e.target.value) / 100);
                    updateSelected({ scaleX: s, scaleY: s });
                  }}
                />
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-ink-3 px-3 py-2.5 text-sm font-semibold text-paper ring-1 ring-white/8 transition hover:bg-ink-4 hover:ring-neon/35"
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
            <InteractionProps el={el} />

            <Section title="Orden">
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { label: 'Adelante', fn: bringForward },
                    { label: 'Atrás', fn: sendBackward },
                    { label: 'Al frente', fn: bringToFront },
                    { label: 'Al fondo', fn: sendToBack },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    className="rounded-xl bg-ink-3 px-2.5 py-2.5 text-sm font-semibold text-paper ring-1 ring-white/8 transition hover:bg-ink-4 hover:ring-neon/35"
                    onClick={b.fn}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="+ Bloque editorial">
              <p className="text-sm text-paper/65">Inserta una composición sin perder la selección actual.</p>
              <div className="grid gap-1.5">
                {EDITORIAL_BLOCKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className="rounded-lg bg-ink-3 px-2.5 py-2 text-left text-sm transition hover:bg-ink-4 hover:ring-1 hover:ring-neon/30"
                    onClick={() => insertEditorialBlock(b.id)}
                  >
                    <span className="font-semibold text-paper">{b.label}</span>
                  </button>
                ))}
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
      <Input
        label="Color"
        type="color"
        value={el.style.color}
        onChange={(e) => patchStyle({ color: e.target.value })}
      />
      <div className="flex flex-wrap gap-2">
        {BRAND_SWATCHES.map((s) => (
          <button
            key={s.id}
            type="button"
            title={s.label}
            aria-label={`Color ${s.label}`}
            className="h-7 w-7 rounded-full border border-white/25 transition hover:scale-110"
            style={{
              background: s.color,
              boxShadow: el.style.color.toLowerCase() === s.color.toLowerCase() ? '0 0 0 2px #4F80FF' : undefined,
            }}
            onClick={() => patchStyle({ color: s.color })}
          />
        ))}
      </div>
      <Select
        label="Alineación"
        value={el.style.align}
        onChange={(e) => patchStyle({ align: e.target.value as TextElement['style']['align'] })}
      >
        <option value="left">Izquierda</option>
        <option value="center">Centro</option>
        <option value="right">Derecha</option>
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
          className={`flex-1 rounded-md px-2 py-2 text-sm ${el.style.italic ? 'bg-accent-soft text-neon' : 'bg-ink-3 text-paper'}`}
          onClick={() => patchStyle({ italic: !el.style.italic })}
        >
          Itálica
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md px-2 py-2 text-sm ${el.style.underline ? 'bg-accent-soft text-neon' : 'bg-ink-3 text-paper'}`}
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
  const hasGradient = Boolean(el.fillGradient?.stops?.length);

  const setSolidFill = (color: string) => {
    updateSelected((item) =>
      item.type === 'shape'
        ? { ...item, fill: color, fillGradient: undefined }
        : item,
    );
  };

  return (
    <Section title="Forma">
      <Input
        label={hasGradient ? 'Relleno (activo: gradiente)' : 'Relleno'}
        type="color"
        value={el.fill}
        onChange={(e) => setSolidFill(e.target.value)}
      />
      {hasGradient ? (
        <p className="text-xs leading-relaxed text-paper/55">
          Al elegir un color sólido se quita el gradiente para que el cambio se vea al instante.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {BRAND_SWATCHES.map((s) => (
          <button
            key={s.id}
            type="button"
            title={s.label}
            aria-label={`Relleno ${s.label}`}
            className="h-7 w-7 rounded-full border border-white/25 transition hover:scale-110"
            style={{ background: s.color, boxShadow: el.fill === s.color && !hasGradient ? `0 0 0 2px #4F80FF` : undefined }}
            onClick={() => setSolidFill(s.color)}
          />
        ))}
      </div>
      <Input
        label="Borde"
        type="color"
        value={el.stroke ?? '#000000'}
        onChange={(e) => updateSelected({ stroke: e.target.value } as Partial<CanvasElement>)}
      />
      <Input
        label="Grosor borde"
        type="number"
        min={0}
        value={el.strokeWidth ?? 0}
        onChange={(e) =>
          updateSelected({ strokeWidth: Number(e.target.value) } as Partial<CanvasElement>)
        }
      />
      {el.shape === 'rect' ? (
        <Input
          label="Radio esquina"
          type="number"
          min={0}
          value={el.cornerRadius ?? 0}
          onChange={(e) =>
            updateSelected({ cornerRadius: Number(e.target.value) } as Partial<CanvasElement>)
          }
        />
      ) : null}
      <button
        type="button"
        className="w-full rounded-xl bg-ink-3 px-3 py-2.5 text-sm font-semibold text-paper ring-1 ring-white/8 transition hover:bg-ink-4 hover:ring-neon/35"
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
        {hasGradient ? (
          'Usar relleno sólido'
        ) : (
          <>
            Aplicar gradiente <span className="notranslate" lang="es" translate="no">PLIEGO</span>
          </>
        )}
      </button>
      {hasGradient ? (
        <Input
          label="Ángulo gradiente"
          type="number"
          value={el.fillGradient?.angle ?? 135}
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
      <p className="text-xs leading-relaxed text-paper/55">
        En el lienzo es un marcador. Autoplay / loop / muted aplican en Preview, publicación y el
        enlace del PDF abre la URL del vídeo.
      </p>
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
            className={`flex-1 rounded-xl px-2 py-2 text-sm font-semibold uppercase ring-1 ring-white/8 ${el[key] ? 'bg-accent-soft text-neon ring-neon/35' : 'bg-ink-3 text-paper'}`}
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
  const patch = (next: Partial<ElementEffects>) =>
    updateSelected((item) => ({
      ...item,
      effects: { ...item.effects, ...next },
    }));

  return (
    <Section title="Efectos">
      <p className="text-xs leading-relaxed text-paper/55">
        Blur, sombra y blend se ven en el lienzo y en el PDF / publicación.
      </p>
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
        min={0}
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
        label="Opacidad sombra"
        type="number"
        min={0}
        max={1}
        step={0.05}
        value={e.shadowOpacity ?? 0.45}
        onChange={(ev) => patch({ shadowOpacity: Number(ev.target.value) })}
      />
      <Input
        label="Color sombra"
        type="color"
        value={e.shadowColor ?? '#000000'}
        onChange={(ev) =>
          patch({
            shadowColor: ev.target.value,
            // Ensure the shadow is visible when picking a color
            shadowBlur: e.shadowBlur && e.shadowBlur > 0 ? e.shadowBlur : 18,
            shadowOffsetY: e.shadowOffsetY || 10,
          })
        }
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

function AnimationProps({
  animation,
  highlight,
}: {
  animation?: ElementAnimation;
  highlight?: boolean;
}) {
  const updateSelected = useEditorStore((s) => s.updateSelected);
  const flashAction = useEditorStore((s) => s.flashAction);
  const a = animation ?? { preset: 'none' as const };
  const patch = (patch: Partial<ElementAnimation>) =>
    updateSelected((item) => ({
      ...item,
      animation: { preset: 'none', ...item.animation, ...patch },
    }));

  return (
    <Section title="Motion">
      {highlight ? (
        <p className="rounded-lg bg-lima/10 px-2.5 py-2 text-sm leading-relaxed text-lima/90 ring-1 ring-lima/25">
          Elige un preset y pulsa <strong className="text-lima">Preview</strong> (⌘P) para verlo en
          vivo. En el canvas estático no se reproduce.
        </p>
      ) : null}
      <Select
        label="Preset de animación"
        value={a.preset}
        onChange={(e) => {
          const preset = e.target.value as ElementAnimation['preset'];
          patch({ preset });
          if (preset !== 'none') flashAction('Motion listo · Preview ⌘P');
        }}
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
  const documentModel = useEditorStore((s) => s.document);
  const i = el.interaction ?? {};
  const pages = [...(documentModel?.pages ?? [])].sort((a, b) => a.order - b.order);

  return (
    <Section title="Interacción">
      <p className="text-sm leading-relaxed text-paper/65">
        Activa Preview (⌘P) y el PDF interactivo: CTAs van a otra página o abren URLs https también
        fuera de PLIEGO.
      </p>
      <Select
        label="Destino rápido"
        value={
          i.href === 'pliego:next'
            ? 'next'
            : i.href === 'pliego:prev'
              ? 'prev'
              : i.href?.startsWith('pliego:page:')
                ? i.href
                : i.href?.startsWith('http')
                  ? 'url'
                  : i.href === '#' || !i.href
                    ? 'next'
                    : 'custom'
        }
        onChange={(e) => {
          const v = e.target.value;
          let href = i.href ?? '';
          if (v === 'next') href = 'pliego:next';
          else if (v === 'prev') href = 'pliego:prev';
          else if (v === 'url') href = i.href?.startsWith('http') ? i.href : 'https://';
          else if (v.startsWith('pliego:page:')) href = v;
          updateSelected((item) => ({
            ...item,
            interaction: {
              ...item.interaction,
              href,
              target: v === 'url' ? '_blank' : '_self',
            },
          }));
        }}
      >
        <option value="next">Siguiente página</option>
        <option value="prev">Página anterior</option>
        {pages.map((p, idx) => (
          <option key={p.id} value={`pliego:page:${p.id}`}>
            Ir a {String(idx + 1).padStart(2, '0')} · {p.name}
          </option>
        ))}
        <option value="url">URL externa</option>
        <option value="custom">Personalizado</option>
      </Select>
      <Input
        label="Enlace (href)"
        value={i.href ?? ''}
        placeholder="pliego:next · https://…"
        onChange={(e) =>
          updateSelected((item) => ({
            ...item,
            interaction: { ...item.interaction, href: e.target.value },
          }))
        }
      />
      <Select
        label="Target"
        value={i.target ?? '_self'}
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
        <option value="_self">Misma vista (preview)</option>
        <option value="_blank">Nueva pestaña</option>
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

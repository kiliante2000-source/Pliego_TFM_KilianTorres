import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Transformer,
  Ellipse,
  Group,
} from 'react-konva';
import type Konva from 'konva';
import { useEditorStore } from '../../stores/editorStore';
import { getActivePage, sortElements } from '../../utils/document';
import type { CanvasElement, ShapeElement } from '../../types/document';
import { konvaShadow } from '../../utils/elementStyle';

function useHtmlImage(src?: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.src = src;
  }, [src]);
  return image;
}

function shapeFillProps(el: ShapeElement) {
  if (el.fillGradient?.stops?.length) {
    const stops = el.fillGradient.stops.flatMap((s) => [s.offset, s.color]);
    if (el.fillGradient.type === 'radial') {
      return {
        fillRadialGradientStartPoint: { x: el.width / 2, y: el.height / 2 },
        fillRadialGradientEndPoint: { x: el.width / 2, y: el.height / 2 },
        fillRadialGradientStartRadius: 0,
        fillRadialGradientEndRadius: Math.max(el.width, el.height) / 2,
        fillRadialGradientColorStops: stops,
      };
    }
    const angle = ((el.fillGradient.angle ?? 135) * Math.PI) / 180;
    return {
      fillLinearGradientStartPoint: {
        x: el.width / 2 - (Math.cos(angle) * el.width) / 2,
        y: el.height / 2 - (Math.sin(angle) * el.height) / 2,
      },
      fillLinearGradientEndPoint: {
        x: el.width / 2 + (Math.cos(angle) * el.width) / 2,
        y: el.height / 2 + (Math.sin(angle) * el.height) / 2,
      },
      fillLinearGradientColorStops: stops,
    };
  }
  return { fill: el.fill };
}

export function EditorCanvas() {
  const documentModel = useEditorStore((s) => s.document);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const zoom = useEditorStore((s) => s.zoom);
  const select = useEditorStore((s) => s.select);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const updateDocument = useEditorStore((s) => s.updateDocument);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const page = useMemo(
    () => (documentModel ? getActivePage(documentModel, activePageId) : undefined),
    [documentModel, activePageId],
  );

  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    const nodes = selectedIds
      .map((id) => stage.findOne(`#${CSS.escape(id)}`))
      .filter(Boolean) as Konva.Node[];
    tr.nodes(nodes);
    tr.getLayer()?.batchDraw();
  }, [selectedIds, page, zoom]);

  if (!documentModel || !page) {
    return <div className="grid h-full place-items-center text-paper/70">Sin documento</div>;
  }

  const stageW = documentModel.meta.width * zoom;
  const stageH = documentModel.meta.height * zoom;

  const patchElement = (id: string, patch: Partial<CanvasElement>, recordHistory = true) => {
    updateDocument(
      (doc) => ({
        ...doc,
        pages: doc.pages.map((p) =>
          p.id !== page.id
            ? p
            : {
                ...p,
                elements: p.elements.map((item) =>
                  item.id === id ? ({ ...item, ...patch } as CanvasElement) : item,
                ),
              },
        ),
      }),
      recordHistory,
    );
  };

  return (
    <div ref={containerRef} className="canvas-stage relative h-full w-full overflow-auto scrollbar-thin">
      <div
        className="flex min-h-full min-w-full items-center justify-center p-10"
        style={{
          minWidth: Math.max(size.width, stageW + 80),
          minHeight: Math.max(size.height, stageH + 80),
        }}
      >
        <div className="shadow-[0_30px_80px_rgba(0,0,0,0.55)]" style={{ width: stageW, height: stageH }}>
          <Stage
            ref={stageRef}
            width={stageW}
            height={stageH}
            scaleX={zoom}
            scaleY={zoom}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) select([]);
            }}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={documentModel.meta.width}
                height={documentModel.meta.height}
                fill={page.background.fill}
                onClick={() => select([])}
              />
              {sortElements(page.elements).map((el) => (
                <CanvasNode
                  key={el.id}
                  el={el}
                  onSelect={(id, multi) => {
                    if (multi) {
                      select(
                        selectedIds.includes(id)
                          ? selectedIds.filter((x) => x !== id)
                          : [...selectedIds, id],
                      );
                    } else {
                      select([id]);
                    }
                  }}
                  onDragStart={() => pushHistory()}
                  onChange={(id, patch) => patchElement(id, patch, false)}
                />
              ))}
              <Transformer
                ref={transformerRef}
                rotateEnabled
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 20 || newBox.height < 20) return oldBox;
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

function CanvasNode({
  el,
  onSelect,
  onChange,
  onDragStart,
}: {
  el: CanvasElement;
  onSelect: (id: string, multi: boolean) => void;
  onChange: (id: string, patch: Partial<CanvasElement>) => void;
  onDragStart: () => void;
}) {
  const image = useHtmlImage(el.type === 'image' ? el.src : undefined);
  const shadow = konvaShadow(el.effects);
  const common = {
    id: el.id,
    name: el.id,
    x: el.x,
    y: el.y,
    width: el.width,
    height: el.height,
    rotation: el.rotation,
    scaleX: el.scaleX,
    scaleY: el.scaleY,
    opacity: el.opacity,
    draggable: !el.locked,
    ...shadow,
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => onSelect(el.id, e.evt.shiftKey),
    onTap: () => onSelect(el.id, false),
    onDragStart: () => onDragStart(),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      onChange(el.id, { x: e.target.x(), y: e.target.y() });
    },
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      onChange(el.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: Math.max(20, Math.abs(node.width() * scaleX)),
        height: Math.max(20, Math.abs(node.height() * scaleY)),
        scaleX: 1,
        scaleY: 1,
      });
    },
  };

  if (el.type === 'text') {
    return (
      <Text
        {...common}
        text={el.text}
        fontSize={el.style.fontSize}
        fontFamily={el.style.fontFamily}
        fontStyle={`${el.style.italic ? 'italic ' : ''}${el.style.fontWeight}`}
        textDecoration={el.style.underline ? 'underline' : undefined}
        fill={el.style.color}
        align={el.style.align === 'justify' ? 'left' : el.style.align}
        lineHeight={el.style.lineHeight ?? 1.2}
        letterSpacing={el.style.letterSpacing ?? 0}
        wrap="word"
      />
    );
  }

  if (el.type === 'button') {
    return (
      <Group
        id={el.id}
        name={el.id}
        x={el.x}
        y={el.y}
        rotation={el.rotation}
        opacity={el.opacity}
        draggable={!el.locked}
        {...shadow}
        onClick={(e) => onSelect(el.id, e.evt.shiftKey)}
        onTap={() => onSelect(el.id, false)}
        onDragStart={() => onDragStart()}
        onDragEnd={(e) => onChange(el.id, { x: e.target.x(), y: e.target.y() })}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange(el.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(40, el.width * Math.abs(scaleX)),
            height: Math.max(28, el.height * Math.abs(scaleY)),
          });
        }}
      >
        <Rect
          width={el.width}
          height={el.height}
          fill={el.fill}
          cornerRadius={el.cornerRadius ?? 999}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth ?? 0}
        />
        <Text
          width={el.width}
          height={el.height}
          text={el.label}
          align="center"
          verticalAlign="middle"
          fontSize={el.fontSize ?? 16}
          fontFamily={el.fontFamily ?? 'Space Grotesk'}
          fontStyle={String(el.fontWeight ?? 600)}
          fill={el.textColor}
        />
      </Group>
    );
  }

  if (el.type === 'video') {
    return (
      <Group
        id={el.id}
        name={el.id}
        x={el.x}
        y={el.y}
        rotation={el.rotation}
        opacity={el.opacity}
        draggable={!el.locked}
        {...shadow}
        onClick={(e) => onSelect(el.id, e.evt.shiftKey)}
        onTap={() => onSelect(el.id, false)}
        onDragStart={() => onDragStart()}
        onDragEnd={(e) => onChange(el.id, { x: e.target.x(), y: e.target.y() })}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange(el.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(80, el.width * Math.abs(scaleX)),
            height: Math.max(60, el.height * Math.abs(scaleY)),
          });
        }}
      >
        <Rect
          width={el.width}
          height={el.height}
          fill="#111318"
          cornerRadius={el.cornerRadius ?? 12}
        />
        <Text
          width={el.width}
          height={el.height}
          text="▶  VÍDEO"
          align="center"
          verticalAlign="middle"
          fontSize={18}
          fontFamily="JetBrains Mono"
          fill="#F4F6F8"
        />
      </Group>
    );
  }

  if (el.type === 'shape' && el.shape === 'ellipse') {
    return (
      <Ellipse
        id={el.id}
        name={el.id}
        x={el.x + el.width / 2}
        y={el.y + el.height / 2}
        radiusX={el.width / 2}
        radiusY={el.height / 2}
        rotation={el.rotation}
        opacity={el.opacity}
        {...shapeFillProps(el)}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth ?? 0}
        draggable={!el.locked}
        {...shadow}
        onClick={(e) => onSelect(el.id, e.evt.shiftKey)}
        onTap={() => onSelect(el.id, false)}
        onDragStart={() => onDragStart()}
        onDragEnd={(e) => {
          onChange(el.id, {
            x: e.target.x() - el.width / 2,
            y: e.target.y() - el.height / 2,
          });
        }}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          const width = Math.max(20, el.width * Math.abs(scaleX));
          const height = Math.max(20, el.height * Math.abs(scaleY));
          onChange(el.id, {
            x: node.x() - width / 2,
            y: node.y() - height / 2,
            width,
            height,
            rotation: node.rotation(),
          });
        }}
      />
    );
  }

  if (el.type === 'shape') {
    return (
      <Rect
        {...common}
        {...shapeFillProps(el)}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth ?? 0}
        cornerRadius={el.cornerRadius ?? 0}
      />
    );
  }

  return (
    <KonvaImage
      {...common}
      image={image ?? undefined}
      cornerRadius={el.type === 'image' ? el.cornerRadius ?? 0 : 0}
    />
  );
}

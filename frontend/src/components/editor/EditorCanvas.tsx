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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { getActivePage, sortElements } from '../../utils/document';
import type { CanvasElement, ShapeElement } from '../../types/document';
import { imageCropForFit, konvaEffectsProps } from '../../utils/elementStyle';
import { useKonvaNodeEffects } from '../../hooks/useKonvaNodeEffects';
import { CanvasStarter } from './StudioGuide';

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

export function EditorCanvas({
  onOpenGuide,
  autoFit = false,
}: {
  onOpenGuide?: () => void;
  /** Keep the full artboard visible inside the viewport (mobile). */
  autoFit?: boolean;
}) {
  const documentModel = useEditorStore((s) => s.document);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const zoom = useEditorStore((s) => s.zoom);
  const select = useEditorStore((s) => s.select);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const updateDocument = useEditorStore((s) => s.updateDocument);
  const flashAction = useEditorStore((s) => s.flashAction);
  const fitZoom = useEditorStore((s) => s.fitZoom);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  /** User pinched / used +/- — never auto-fit again until they tap Encajar */
  const userZoomLock = useRef(false);
  /** One successful fit per artboard — never re-fit from ResizeObserver (mobile chrome was jittering) */
  const fittedDocKey = useRef('');
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [editing, setEditing] = useState<{
    id: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    align: string;
    lineHeight: number;
  } | null>(null);

  const docKey = documentModel
    ? `${documentModel.meta.templateId ?? ''}:${documentModel.meta.width}x${documentModel.meta.height}`
    : '';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      // Debounce RO → avoid zoom thrash when scrollbars appear/disappear
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        setSize((prev) =>
          Math.abs(prev.width - w) < 2 && Math.abs(prev.height - h) < 2
            ? prev
            : { width: w, height: h },
        );
      });
    });
    ro.observe(el);
    setSize({ width: el.clientWidth, height: el.clientHeight });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const centerBoard = () => {
    const node = containerRef.current;
    if (!node) return;
    node.scrollLeft = Math.max(0, (node.scrollWidth - node.clientWidth) / 2);
    node.scrollTop = Math.max(0, (node.scrollHeight - node.clientHeight) / 2);
  };

  const runFit = (force = false) => {
    if (!force && userZoomLock.current) return false;
    const el = containerRef.current;
    if (!el) return false;
    const w = Math.min(el.clientWidth, document.documentElement.clientWidth, window.innerWidth);
    const h = Math.min(el.clientHeight, window.innerHeight);
    if (w < 40 || h < 40) return false;
    // Generous padding so the full format stays inside without a second corrective jump
    const pad = Math.max(48, Math.round(Math.min(w, h) * 0.06));
    fitZoom(w, h, pad);
    requestAnimationFrame(() => requestAnimationFrame(centerBoard));
    return true;
  };

  // Fit exactly once when the artboard identity is ready and the container has size.
  // ResizeObserver must NOT re-fit — mobile browser chrome resize was the jitter source.
  useEffect(() => {
    if (!autoFit || !docKey) return;
    if (fittedDocKey.current === docKey) return;
    if (size.width < 40 || size.height < 40) return;

    userZoomLock.current = false;
    const t = window.setTimeout(() => {
      if (fittedDocKey.current === docKey) return;
      if (runFit(true)) fittedDocKey.current = docKey;
    }, 40);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFit, docKey, size.width >= 40, size.height >= 40]);

  useEffect(() => {
    if (!autoFit) return;
    const onManualZoom = () => {
      userZoomLock.current = true;
    };
    const onFitRequest = () => {
      userZoomLock.current = false;
      if (runFit(true)) fittedDocKey.current = docKey;
    };
    const onOrientation = () => {
      // Real device rotate only — ignore soft viewport resizes
      userZoomLock.current = false;
      fittedDocKey.current = '';
      window.setTimeout(() => {
        if (runFit(true)) fittedDocKey.current = docKey;
      }, 250);
    };
    window.addEventListener('pliego-zoom-manual', onManualZoom);
    window.addEventListener('pliego-zoom-fit', onFitRequest);
    window.addEventListener('orientationchange', onOrientation);
    return () => {
      window.removeEventListener('pliego-zoom-manual', onManualZoom);
      window.removeEventListener('pliego-zoom-fit', onFitRequest);
      window.removeEventListener('orientationchange', onOrientation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFit, docKey]);

  // Pinch zoom + pan + horizontal swipe between pages (mobile).
  // Capture phase so Konva/canvas cannot swallow the gestures.
  useEffect(() => {
    if (!autoFit) return;
    const el = containerRef.current;
    if (!el) return;

    const dist = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    type FingerState = {
      x: number;
      y: number;
      t: number;
      scrollLeft: number;
      scrollTop: number;
      mode: 'undecided' | 'pan' | 'swipe';
    };
    let finger: FingerState | null = null;

    const goPage = (dir: -1 | 1) => {
      const { document: doc, activePageId, setActivePage, flashAction } =
        useEditorStore.getState();
      if (!doc?.pages.length) return;
      const ordered = [...doc.pages].sort((a, b) => a.order - b.order);
      const idx = ordered.findIndex((p) => p.id === activePageId);
      if (idx < 0) return;
      const next = ordered[idx + dir];
      if (!next) return;
      setActivePage(next.id);
      flashAction(
        dir > 0 ? `Página ${idx + 2}/${ordered.length}` : `Página ${idx}/${ordered.length}`,
      );
      // Re-center after page change
      requestAnimationFrame(() => {
        el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
        el.scrollTop = Math.max(0, (el.scrollHeight - el.clientHeight) / 2);
      });
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        finger = null;
        pinchRef.current = {
          startDist: dist(e.touches),
          startZoom: useEditorStore.getState().zoom,
        };
        return;
      }
      if (e.touches.length !== 1) return;
      pinchRef.current = null;
      const stage = stageRef.current;
      // If user is dragging a Konva node, don't fight it
      if (stage?.isDragging()) {
        finger = null;
        return;
      }
      finger = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        t: performance.now(),
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop,
        mode: 'undecided',
      };
    };

    const onMove = (e: TouchEvent) => {
      if (e.touches.length >= 2 && pinchRef.current) {
        if (pinchRef.current.startDist < 10) return;
        e.preventDefault();
        userZoomLock.current = true;
        const ratio = dist(e.touches) / pinchRef.current.startDist;
        useEditorStore.getState().setZoom(pinchRef.current.startZoom * ratio);
        finger = null;
        return;
      }

      if (e.touches.length !== 1 || !finger) return;
      const dx = e.touches[0].clientX - finger.x;
      const dy = e.touches[0].clientY - finger.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (finger.mode === 'undecided' && (absX > 12 || absY > 12)) {
        const canPan =
          el.scrollWidth > el.clientWidth + 24 || el.scrollHeight > el.clientHeight + 24;
        // Near fit: horizontal wins as page swipe. Zoomed: prefer pan unless clear flick later.
        if (!canPan && absX > absY * 1.15) finger.mode = 'swipe';
        else if (canPan) finger.mode = 'pan';
        else if (absX > absY * 1.25) finger.mode = 'swipe';
        else finger.mode = 'pan';
      }

      if (finger.mode === 'swipe') {
        e.preventDefault();
        el.scrollLeft = finger.scrollLeft;
        el.scrollTop = finger.scrollTop;
        return;
      }

      // Pan the viewport so the user can explore a zoomed artboard
      e.preventDefault();
      el.scrollLeft = finger.scrollLeft - dx;
      el.scrollTop = finger.scrollTop - dy;
    };

    const onEnd = (e: TouchEvent) => {
      if (e.touches.length >= 2) return;
      if (pinchRef.current && e.touches.length < 2) pinchRef.current = null;

      if (!finger) return;
      if (e.touches.length > 0) return; // still one finger down somehow

      const t = e.changedTouches[0];
      if (!t) {
        finger = null;
        return;
      }
      const dx = t.clientX - finger.x;
      const dy = t.clientY - finger.y;
      const dt = Math.max(16, performance.now() - finger.t);
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const velocity = absX / dt;
      const mode = finger.mode;
      finger = null;

      const horizontal = absX > absY * 1.2;
      const swipeIntent =
        mode === 'swipe' ||
        (horizontal && absX > 64 && velocity > 0.45) ||
        (horizontal && absX > 96);

      if (swipeIntent && absX > 48) {
        goPage(dx < 0 ? 1 : -1);
      }
    };

    const optsPassive = { passive: true, capture: true } as const;
    const optsMove = { passive: false, capture: true } as const;
    el.addEventListener('touchstart', onStart, optsPassive);
    el.addEventListener('touchmove', onMove, optsMove);
    el.addEventListener('touchend', onEnd, optsPassive);
    el.addEventListener('touchcancel', onEnd, optsPassive);
    return () => {
      el.removeEventListener('touchstart', onStart, true);
      el.removeEventListener('touchmove', onMove, true);
      el.removeEventListener('touchend', onEnd, true);
      el.removeEventListener('touchcancel', onEnd, true);
    };
  }, [autoFit]);

  const page = useMemo(
    () => (documentModel ? getActivePage(documentModel, activePageId) : undefined),
    [documentModel, activePageId],
  );
  const addText = useEditorStore((s) => s.addText);
  const addShape = useEditorStore((s) => s.addShape);
  const insertEditorialBlock = useEditorStore((s) => s.insertEditorialBlock);

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

  const snapValue = (value: number, target: number, threshold = 8) =>
    Math.abs(value - target) <= threshold ? target : value;

  const commitEdit = () => {
    if (!editing) return;
    patchElement(editing.id, { text: editing.text } as Partial<CanvasElement>, true);
    flashAction('Texto actualizado');
    setEditing(null);
  };

  const stagePad = autoFit ? 24 : 40;

  const orderedPages = useMemo(
    () =>
      documentModel
        ? [...documentModel.pages].sort((a, b) => a.order - b.order)
        : [],
    [documentModel],
  );
  const pageIndex = orderedPages.findIndex((p) => p.id === activePageId);
  const goAdjacentPage = (dir: -1 | 1) => {
    const next = orderedPages[pageIndex + dir];
    if (!next) return;
    useEditorStore.getState().setActivePage(next.id);
    useEditorStore
      .getState()
      .flashAction(
        `Página ${pageIndex + dir + 1}/${orderedPages.length}`,
      );
  };

  return (
    <div className="relative h-full w-full">
    <div
      ref={containerRef}
      data-editor-canvas
      className="canvas-stage relative h-full w-full overflow-auto overscroll-contain scrollbar-thin"
      /* none: we own pinch + swipe + pan */
      style={autoFit ? { touchAction: 'none' } : undefined}
    >
      {page.elements.length === 0 ? (
        <CanvasStarter
          onAddText={() => addText('display')}
          onAddShape={() => addShape('rect', true)}
          onAddBlock={() => insertEditorialBlock('hero-display')}
          onOpenGuide={() => onOpenGuide?.()}
        />
      ) : null}
      <div
        className="flex min-h-full min-w-full items-center justify-center"
        style={{
          padding: stagePad,
          minWidth: Math.max(size.width, stageW + stagePad * 2),
          minHeight: Math.max(size.height, stageH + stagePad * 2),
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
          style={{
            width: stageW,
            height: stageH,
            borderRadius: 16,
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
            maskImage: 'radial-gradient(white, black)',
          }}
        >
          <Stage
            ref={stageRef}
            width={stageW}
            height={stageH}
            scaleX={zoom}
            scaleY={zoom}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                select([]);
                if (editing) commitEdit();
              }
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
                  canvasW={documentModel.meta.width}
                  canvasH={documentModel.meta.height}
                  hidden={editing?.id === el.id}
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
                  onSnapChange={(id, x, y, w, h) => {
                    const cx = documentModel.meta.width / 2;
                    const cy = documentModel.meta.height / 2;
                    let sx = x;
                    let sy = y;
                    sx = snapValue(sx, 0);
                    sx = snapValue(sx, cx - w / 2);
                    sx = snapValue(sx, documentModel.meta.width - w);
                    sy = snapValue(sy, 0);
                    sy = snapValue(sy, cy - h / 2);
                    sy = snapValue(sy, documentModel.meta.height - h);
                    patchElement(id, { x: sx, y: sy }, false);
                  }}
                  onEditText={(node) => {
                    if (node.type !== 'text' || node.locked) return;
                    select([node.id]);
                    setEditing({
                      id: node.id,
                      text: node.text,
                      x: node.x * zoom,
                      y: node.y * zoom,
                      width: node.width * zoom,
                      height: Math.max(node.height * zoom, 40),
                      fontSize: node.style.fontSize * zoom,
                      fontFamily: node.style.fontFamily,
                      color: node.style.color,
                      align: node.style.align,
                      lineHeight: node.style.lineHeight ?? 1.2,
                    });
                    flashAction('Editando texto');
                  }}
                  onTransformStart={() => pushHistory()}
                />
              ))}
              {!editing ? (
                <Transformer
                  ref={transformerRef}
                  rotateEnabled
                  rotateAnchorOffset={28}
                  borderStroke="#4F80FF"
                  borderStrokeWidth={2.5}
                  borderDash={[]}
                  anchorStroke="#4F80FF"
                  anchorFill="#F4F6F8"
                  anchorSize={10}
                  anchorCornerRadius={2}
                  padding={4}
                  ignoreStroke
                  enabledAnchors={[
                    'top-left',
                    'top-center',
                    'top-right',
                    'middle-left',
                    'middle-right',
                    'bottom-left',
                    'bottom-center',
                    'bottom-right',
                  ]}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                    return newBox;
                  }}
                />
              ) : null}
            </Layer>
          </Stage>

          {editing ? (
            <textarea
              autoFocus
              value={editing.text}
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              onBlur={() => commitEdit()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setEditing(null);
                }
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  commitEdit();
                }
              }}
              className="absolute z-20 resize-none border-2 border-neon bg-ink/95 p-2 text-paper outline-none shadow-[0_0_0_4px_rgba(79,128,255,0.25)]"
              style={{
                left: editing.x,
                top: editing.y,
                width: editing.width,
                height: editing.height,
                fontSize: editing.fontSize,
                fontFamily: editing.fontFamily,
                color: editing.color,
                textAlign: editing.align as CanvasTextAlign,
                lineHeight: editing.lineHeight,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>

      {autoFit && orderedPages.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-1.5">
          <button
            type="button"
            aria-label="Página anterior"
            disabled={pageIndex <= 0}
            onClick={() => goAdjacentPage(-1)}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink/80 text-paper shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition enabled:active:scale-95 disabled:opacity-25"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Página siguiente"
            disabled={pageIndex < 0 || pageIndex >= orderedPages.length - 1}
            onClick={() => goAdjacentPage(1)}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink/80 text-paper shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition enabled:active:scale-95 disabled:opacity-25"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function transformSize(
  el: CanvasElement,
  node: Konva.Node,
  minW: number,
  minH: number,
) {
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();
  node.scaleX(el.scaleX || 1);
  node.scaleY(el.scaleY || 1);
  return {
    x: node.x(),
    y: node.y(),
    rotation: node.rotation(),
    width: Math.max(minW, Math.abs(el.width * scaleX)),
    height: Math.max(minH, Math.abs(el.height * scaleY)),
    scaleX: el.scaleX || 1,
    scaleY: el.scaleY || 1,
  };
}

function CanvasNode({
  el,
  canvasW: _canvasW,
  canvasH: _canvasH,
  hidden,
  onSelect,
  onChange,
  onSnapChange,
  onEditText,
  onDragStart,
  onTransformStart,
}: {
  el: CanvasElement;
  canvasW: number;
  canvasH: number;
  hidden?: boolean;
  onSelect: (id: string, multi: boolean) => void;
  onChange: (id: string, patch: Partial<CanvasElement>) => void;
  onSnapChange: (id: string, x: number, y: number, w: number, h: number) => void;
  onEditText: (el: CanvasElement) => void;
  onDragStart: () => void;
  onTransformStart: () => void;
}) {
  const nodeRef = useRef<Konva.Node | null>(null);
  const image = useHtmlImage(el.type === 'image' ? el.src : undefined);
  const fx = konvaEffectsProps(el.effects);

  useKonvaNodeEffects(nodeRef, el.effects, [
    el.width,
    el.height,
    el.scaleX,
    el.scaleY,
    el.opacity,
    el.type === 'text' ? el.text : '',
    el.type === 'shape' ? el.fill : '',
    el.type === 'image' ? el.src : '',
    fx.blurRadius,
    fx.shadowBlur,
    fx.shadowOffsetX,
    fx.shadowOffsetY,
  ]);

  if (hidden) return null;

  const bindRef = (node: Konva.Node | null) => {
    nodeRef.current = node;
  };

  const selectHandlers = {
    onClick: (e: Konva.KonvaEventObject<MouseEvent>) => onSelect(el.id, e.evt.shiftKey),
    onTap: () => onSelect(el.id, false),
    onDblClick: () => onEditText(el),
    onDblTap: () => onEditText(el),
    onDragStart: () => onDragStart(),
    onTransformStart: () => onTransformStart(),
  };

  const effectProps = {
    opacity: el.opacity,
    shadowColor: fx.shadowColor,
    shadowBlur: fx.shadowBlur,
    shadowOffsetX: fx.shadowOffsetX,
    shadowOffsetY: fx.shadowOffsetY,
    shadowOpacity: fx.shadowOpacity,
    shadowEnabled: fx.shadowEnabled,
    filters: fx.filters,
    blurRadius: fx.blurRadius,
    globalCompositeOperation: fx.globalCompositeOperation,
  };

  if (el.type === 'text') {
    let displayText = el.text;
    if (el.style.textTransform === 'uppercase') displayText = el.text.toUpperCase();
    else if (el.style.textTransform === 'lowercase') displayText = el.text.toLowerCase();
    else if (el.style.textTransform === 'capitalize') {
      displayText = el.text.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return (
      <Text
        ref={bindRef as never}
        id={el.id}
        name={el.id}
        x={el.x}
        y={el.y}
        width={el.width}
        height={el.height}
        rotation={el.rotation}
        scaleX={el.scaleX}
        scaleY={el.scaleY}
        draggable={!el.locked}
        {...effectProps}
        {...selectHandlers}
        text={displayText}
        fontSize={el.style.fontSize}
        fontFamily={el.style.fontFamily}
        fontStyle={`${el.style.italic ? 'italic ' : ''}${el.style.fontWeight}`}
        textDecoration={el.style.underline ? 'underline' : undefined}
        fill={el.style.color}
        align={el.style.align === 'justify' ? 'left' : el.style.align}
        lineHeight={el.style.lineHeight ?? 1.2}
        letterSpacing={el.style.letterSpacing ?? 0}
        wrap="word"
        onDragEnd={(e) => onSnapChange(el.id, e.target.x(), e.target.y(), el.width, el.height)}
        onTransformEnd={(e) => onChange(el.id, transformSize(el, e.target, 20, 20))}
      />
    );
  }

  if (el.type === 'button') {
    return (
      <Group
        ref={bindRef as never}
        id={el.id}
        name={el.id}
        x={el.x}
        y={el.y}
        rotation={el.rotation}
        scaleX={el.scaleX}
        scaleY={el.scaleY}
        draggable={!el.locked}
        {...effectProps}
        {...selectHandlers}
        onDragEnd={(e) => onSnapChange(el.id, e.target.x(), e.target.y(), el.width, el.height)}
        onTransformEnd={(e) => onChange(el.id, transformSize(el, e.target, 40, 28))}
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
    const flags = [
      el.autoplay ? 'AUTO' : null,
      el.loop ? 'LOOP' : null,
      el.muted ? 'MUTE' : null,
    ]
      .filter(Boolean)
      .join(' · ');
    return (
      <Group
        ref={bindRef as never}
        id={el.id}
        name={el.id}
        x={el.x}
        y={el.y}
        rotation={el.rotation}
        scaleX={el.scaleX}
        scaleY={el.scaleY}
        draggable={!el.locked}
        {...effectProps}
        {...selectHandlers}
        onDragEnd={(e) => onSnapChange(el.id, e.target.x(), e.target.y(), el.width, el.height)}
        onTransformEnd={(e) => onChange(el.id, transformSize(el, e.target, 80, 60))}
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
          text={flags ? `▶  VÍDEO\n${flags}` : '▶  VÍDEO'}
          align="center"
          verticalAlign="middle"
          fontSize={16}
          fontFamily="JetBrains Mono"
          fill="#F4F6F8"
          lineHeight={1.4}
        />
      </Group>
    );
  }

  if (el.type === 'shape' && el.shape === 'ellipse') {
    return (
      <Ellipse
        ref={bindRef as never}
        id={el.id}
        name={el.id}
        x={el.x + el.width / 2}
        y={el.y + el.height / 2}
        radiusX={el.width / 2}
        radiusY={el.height / 2}
        rotation={el.rotation}
        scaleX={el.scaleX}
        scaleY={el.scaleY}
        {...shapeFillProps(el)}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth ?? 0}
        draggable={!el.locked}
        {...effectProps}
        {...selectHandlers}
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
          node.scaleX(el.scaleX || 1);
          node.scaleY(el.scaleY || 1);
          const width = Math.max(20, el.width * Math.abs(scaleX));
          const height = Math.max(20, el.height * Math.abs(scaleY));
          onChange(el.id, {
            x: node.x() - width / 2,
            y: node.y() - height / 2,
            width,
            height,
            rotation: node.rotation(),
            scaleX: el.scaleX || 1,
            scaleY: el.scaleY || 1,
          });
        }}
      />
    );
  }

  if (el.type === 'shape') {
    return (
      <Rect
        ref={bindRef as never}
        id={el.id}
        name={el.id}
        x={el.x}
        y={el.y}
        width={el.width}
        height={el.height}
        rotation={el.rotation}
        scaleX={el.scaleX}
        scaleY={el.scaleY}
        draggable={!el.locked}
        {...shapeFillProps(el)}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth ?? 0}
        cornerRadius={el.cornerRadius ?? 0}
        {...effectProps}
        {...selectHandlers}
        onDragEnd={(e) => onSnapChange(el.id, e.target.x(), e.target.y(), el.width, el.height)}
        onTransformEnd={(e) => onChange(el.id, transformSize(el, e.target, 20, 20))}
      />
    );
  }

  // Image — fit + corner radius via clip group
  const fit = el.type === 'image' ? el.fit ?? 'cover' : 'cover';
  const radius = el.type === 'image' ? el.cornerRadius ?? 0 : 0;
  const layout =
    image != null
      ? imageCropForFit(image, el.width, el.height, fit)
      : { width: el.width, height: el.height, offsetX: 0, offsetY: 0 };

  return (
    <Group
      ref={bindRef as never}
      id={el.id}
      name={el.id}
      x={el.x}
      y={el.y}
      rotation={el.rotation}
      scaleX={el.scaleX}
      scaleY={el.scaleY}
      draggable={!el.locked}
      {...effectProps}
      {...selectHandlers}
      clipFunc={
        radius > 0
          ? (ctx) => {
              const r = Math.min(radius, el.width / 2, el.height / 2);
              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.arcTo(el.width, 0, el.width, el.height, r);
              ctx.arcTo(el.width, el.height, 0, el.height, r);
              ctx.arcTo(0, el.height, 0, 0, r);
              ctx.arcTo(0, 0, el.width, 0, r);
              ctx.closePath();
            }
          : undefined
      }
      onDragEnd={(e) => onSnapChange(el.id, e.target.x(), e.target.y(), el.width, el.height)}
      onTransformEnd={(e) => onChange(el.id, transformSize(el, e.target, 20, 20))}
    >
      {image ? (
        <KonvaImage
          image={image}
          x={layout.offsetX}
          y={layout.offsetY}
          width={layout.width}
          height={layout.height}
          crop={layout.crop}
        />
      ) : (
        <Rect width={el.width} height={el.height} fill="#1a1f28" />
      )}
    </Group>
  );
}

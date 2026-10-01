import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import type { DocumentModel } from '../../types/document';
import { useElementSize } from '../../hooks/useElementSize';
import { PublicRenderer } from './PublicRenderer';

/**
 * Mobile-first viewer: always starts with the full artboard visible
 * (letterboxed), then the user can pinch or tap to zoom.
 */
export function ZoomablePublicView({
  document,
  className,
}: {
  document: DocumentModel;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { width: frameW, height: frameH } = useElementSize(frameRef);
  const [userScale, setUserScale] = useState<number | null>(null);
  const pinchRef = useRef<{ startDist: number; startScale: number } | null>(null);

  const fitScale = useMemo(() => {
    if (frameW < 40 || frameH < 40) return 0.2;
    const pad = 24;
    return Math.min(
      (frameW - pad) / document.meta.width,
      (frameH - pad) / document.meta.height,
      1,
    );
  }, [frameW, frameH, document.meta.width, document.meta.height]);

  // Reset to fit whenever the document or viewport changes (orientation)
  useEffect(() => {
    setUserScale(null);
  }, [document.meta.width, document.meta.height, frameW, frameH]);

  const scale = userScale ?? fitScale;
  const fitWidth = document.meta.width * scale;

  const bump = useCallback(
    (delta: number) => {
      setUserScale((prev) => {
        const base = prev ?? fitScale;
        return Math.min(2.5, Math.max(0.08, base + delta));
      });
    },
    [fitScale],
  );

  const fit = useCallback(() => setUserScale(null), []);

  // Pinch to zoom
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const dist = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchRef.current = {
          startDist: dist(e.touches),
          startScale: userScale ?? fitScale,
        };
      }
    };

    const onMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinchRef.current) return;
      if (pinchRef.current.startDist < 12) return;
      e.preventDefault();
      const ratio = dist(e.touches) / pinchRef.current.startDist;
      setUserScale(
        Math.min(2.5, Math.max(0.08, pinchRef.current.startScale * ratio)),
      );
    };

    const onEnd = () => {
      pinchRef.current = null;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [fitScale, userScale]);

  // Keep the board centered after fit / zoom changes
  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollLeft = Math.max(0, (node.scrollWidth - node.clientWidth) / 2);
      node.scrollTop = Math.max(0, (node.scrollHeight - node.clientHeight) / 2);
    });
  }, [scale, fitWidth]);

  return (
    <div ref={frameRef} className={className ?? 'relative flex min-h-[70svh] flex-col'}>
      <div
        ref={scrollerRef}
        className="relative min-h-0 flex-1 touch-pan-x touch-pan-y overflow-auto overscroll-contain scrollbar-thin"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <div className="flex min-h-full min-w-full items-center justify-center p-3">
          <PublicRenderer
            document={document}
            fitWidth={fitWidth}
            className="mx-auto"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/12 bg-ink/85 px-1.5 py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <button
            type="button"
            aria-label="Alejar"
            className="grid h-9 w-9 place-items-center rounded-full text-paper/80 transition hover:bg-white/10 hover:text-paper"
            onClick={() => bump(-0.1)}
          >
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            aria-label="Encajar formato completo"
            className="grid h-9 w-9 place-items-center rounded-full text-paper/80 transition hover:bg-white/10 hover:text-paper"
            onClick={fit}
          >
            <Maximize2 size={15} />
          </button>
          <button
            type="button"
            aria-label="Acercar"
            className="grid h-9 w-9 place-items-center rounded-full text-paper/80 transition hover:bg-white/10 hover:text-paper"
            onClick={() => bump(0.1)}
          >
            <ZoomIn size={16} />
          </button>
          <span className="min-w-[3.25rem] px-1.5 text-center font-mono text-[0.65rem] tabular-nums text-paper/55">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

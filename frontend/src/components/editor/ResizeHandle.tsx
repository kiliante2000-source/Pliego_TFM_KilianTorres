import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Drag handle between studio columns.
 * `edge="after"` grows the panel on the left when dragging right.
 * `edge="before"` grows the panel on the right when dragging left.
 */
export function ResizeHandle({
  value,
  onChange,
  edge = 'after',
  label,
  inverted,
  defaultWidth,
}: {
  value: number;
  onChange: (next: number) => void;
  edge?: 'after' | 'before';
  label: string;
  /** If true, dragging right decreases width (for right-side panels). */
  inverted?: boolean;
  defaultWidth?: number;
}) {
  const startX = useRef(0);
  const startW = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      const signed = inverted ? -delta : delta;
      onChange(startW.current + signed);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [inverted, onChange]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Redimensionar ${label}`}
      title={`Arrastra para cambiar el ancho de ${label} · doble clic restablece`}
      tabIndex={0}
      onPointerDown={(e) => {
        e.preventDefault();
        dragging.current = true;
        startX.current = e.clientX;
        startW.current = value;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onDoubleClick={() => onChange(defaultWidth ?? value)}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 24 : 12;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onChange(value + (inverted ? step : -step));
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          onChange(value + (inverted ? -step : step));
        }
      }}
      className={cn(
        'group relative z-40 w-1.5 shrink-0 cursor-col-resize touch-none',
        'bg-transparent transition-colors hover:bg-neon/35 focus:bg-neon/40 focus:outline-none',
        edge === 'after' ? '-ml-px' : '-mr-px',
      )}
    >
      <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10 group-hover:bg-neon/70 group-focus:bg-neon" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 opacity-0 transition group-hover:opacity-100 group-focus:opacity-100" />
    </div>
  );
}

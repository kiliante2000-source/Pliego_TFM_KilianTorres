import { PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '../../utils/cn';

/** Slim vertical rail to restore a collapsed studio column. */
export function CollapsedRail({
  side,
  label,
  onExpand,
}: {
  side: 'left' | 'right';
  label: string;
  onExpand: () => void;
}) {
  const Icon = side === 'left' ? PanelLeft : PanelRight;
  return (
    <button
      type="button"
      title={`Mostrar ${label}`}
      aria-label={`Mostrar ${label}`}
      onClick={onExpand}
      className={cn(
        'group relative z-40 flex w-9 shrink-0 flex-col items-center justify-center gap-2',
        'border-white/10 bg-ink-2/90 text-paper/55 transition',
        'hover:bg-ink-3 hover:text-neon focus:outline-none focus-visible:ring-2 focus-visible:ring-neon/50',
        side === 'left' ? 'border-r' : 'border-l',
      )}
    >
      <Icon size={16} strokeWidth={1.75} />
      <span
        className="select-none font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-paper/45 group-hover:text-neon"
        style={{ writingMode: 'vertical-rl', transform: side === 'left' ? 'rotate(180deg)' : undefined }}
      >
        {label}
      </span>
    </button>
  );
}

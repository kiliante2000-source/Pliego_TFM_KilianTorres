import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { TemplateInfo } from '../../types/document';

type Visual = {
  label: string;
  flat: string;
  glow: string;
  mesh: string[];
  mark: string;
  motif: 'slash' | 'circle' | 'bars' | 'type' | 'grid' | 'wave';
};

/** Identidad visual por plantilla — color memorable, no degradado genérico. */
const VISUALS: Record<string, Visual> = {
  'manifesto-digital': {
    label: 'Editorial digital',
    flat: '#FF2D95',
    glow: 'rgba(255, 45, 149, 0.55)',
    mesh: ['#FF2D95', '#7C3AED', '#1D4ED8'],
    mark: 'M',
    motif: 'slash',
  },
  'portfolio-kinetic': {
    label: 'Editorial digital',
    flat: '#22D3EE',
    glow: 'rgba(34, 211, 238, 0.5)',
    mesh: ['#22D3EE', '#6366F1', '#F472B6'],
    mark: 'PK',
    motif: 'type',
  },
  'portada-editorial': {
    label: 'Portada',
    flat: '#4F80FF',
    glow: 'rgba(79, 128, 255, 0.55)',
    mesh: ['#4F80FF', '#A855F7', '#FF4EDB'],
    mark: '01',
    motif: 'circle',
  },
  'revista-doble': {
    label: 'Revista',
    flat: '#A3E635',
    glow: 'rgba(163, 230, 53, 0.45)',
    mesh: ['#A3E635', '#14B8A6', '#0EA5E9'],
    mark: 'R',
    motif: 'bars',
  },
  'catalogo-producto': {
    label: 'Catálogo',
    flat: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.5)',
    mesh: ['#F59E0B', '#EF4444', '#EC4899'],
    mark: 'LK',
    motif: 'grid',
  },
  'presentacion-slide': {
    label: 'Presentación',
    flat: '#C084FC',
    glow: 'rgba(192, 132, 252, 0.55)',
    mesh: ['#C084FC', '#F472B6', '#38BDF8'],
    mark: '▶',
    motif: 'wave',
  },
};

const FALLBACK: Visual = {
  label: 'Plantilla',
  flat: '#4F80FF',
  glow: 'rgba(79, 128, 255, 0.45)',
  mesh: ['#4F80FF', '#A855F7', '#FF4EDB'],
  mark: 'P',
  motif: 'circle',
};

function Motif({ kind, mark }: { kind: Visual['motif']; mark: string }) {
  if (kind === 'slash') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-6 top-2 h-[140%] w-10 rotate-12 bg-black/25" />
        <div className="absolute left-10 top-2 h-[140%] w-3 rotate-12 bg-white/30" />
        <span className="absolute bottom-3 left-3 font-display text-4xl font-extrabold tracking-tighter text-white/90">
          {mark}
        </span>
      </div>
    );
  }
  if (kind === 'circle') {
    return (
      <div className="absolute inset-0">
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/25 blur-[1px]" />
        <div className="absolute bottom-3 left-3 font-mono text-xs font-semibold tracking-[0.2em] text-white/90">
          VOL · {mark}
        </div>
      </div>
    );
  }
  if (kind === 'bars') {
    return (
      <div className="absolute inset-0 flex items-end gap-1.5 p-3">
        {[40, 70, 55, 85, 48].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-black/30"
            style={{ height: `${h}%` }}
          />
        ))}
        <span className="absolute right-3 top-3 font-display text-2xl font-bold text-black/50">
          {mark}
        </span>
      </div>
    );
  }
  if (kind === 'type') {
    return (
      <div className="absolute inset-0 flex flex-col justify-end p-3">
        <p className="font-display text-[28px] font-extrabold leading-[0.85] tracking-tighter text-white">
          WORK
          <br />
          THAT
          <br />
          MOVES
        </p>
      </div>
    );
  }
  if (kind === 'grid') {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-1.5 p-3">
        <div className="rounded-md bg-black/25" />
        <div className="rounded-md bg-white/25" />
        <div className="col-span-2 rounded-md bg-black/20" />
        <span className="absolute left-3 top-3 font-mono text-[10px] font-semibold tracking-widest text-black/60">
          {mark}
        </span>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-0 right-0 top-1/2 h-8 -translate-y-1/2 bg-white/20" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/35 to-transparent" />
      <span className="absolute bottom-3 left-3 text-lg text-white">{mark}</span>
    </div>
  );
}

export function BlankTemplateCard({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-2xl border text-left transition',
        selected
          ? 'border-neon/70 bg-ink-2 ring-1 ring-neon/40'
          : 'border-line bg-ink-2/60 hover:border-paper-muted/30',
      )}
    >
      <div className="relative h-28 overflow-hidden bg-[#12171e]">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(79,128,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(79,128,255,0.25)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={cn(
              'text-paper-muted transition group-hover:text-neon',
              selected && 'text-neon',
            )}
            size={26}
          />
        </div>
      </div>
      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted">Canvas</p>
        <p className="mt-1 text-sm font-semibold text-paper">En blanco</p>
        <p className="mt-1 font-mono text-[10px] text-paper-muted">1080 × 1350</p>
      </div>
    </button>
  );
}

export function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: TemplateInfo;
  selected: boolean;
  onSelect: () => void;
}) {
  const visual = VISUALS[template.id] ?? FALLBACK;
  const [a, b, c] = visual.mesh;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-2xl border text-left transition duration-300',
        selected
          ? 'border-white/40 ring-2 ring-offset-0'
          : 'border-line hover:border-white/25',
      )}
      style={
        selected
          ? ({
              ['--tw-ring-color' as string]: visual.flat,
              boxShadow: `0 0 0 1px ${visual.flat}55, 0 18px 40px ${visual.glow}`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="relative h-28 overflow-hidden" style={{ background: visual.flat }}>
        {/* Color plano + mesh animado al hover */}
        <motion.div
          className="absolute -inset-[40%] opacity-80 mix-blend-soft-light"
          style={{
            background: `conic-gradient(from 120deg at 40% 40%, ${a}, ${b}, ${c}, ${a})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
        />
        <motion.div
          className="absolute -left-1/4 -top-1/3 h-[140%] w-[80%] rounded-full opacity-70 blur-2xl"
          style={{ background: b }}
          animate={{ x: [0, 28, -12, 0], y: [0, -18, 10, 0] }}
          transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 h-[120%] w-[70%] rounded-full opacity-60 blur-2xl"
          style={{ background: c }}
          animate={{ x: [0, -22, 16, 0], y: [0, 14, -20, 0] }}
          transition={{ duration: 8.5, ease: 'easeInOut', repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
        <Motif kind={visual.motif} mark={visual.mark} />
        <div
          className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full ring-2 ring-black/20"
          style={{ background: '#fff', boxShadow: `0 0 12px ${visual.glow}` }}
          title={visual.flat}
        />
      </div>
      <div className="relative bg-ink-2 p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: visual.flat }}
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted">
            {visual.label}
          </p>
        </div>
        <p className="text-sm font-semibold text-paper">{template.name}</p>
        <p className="mt-1 line-clamp-2 text-xs text-paper-muted">{template.description}</p>
      </div>
    </button>
  );
}

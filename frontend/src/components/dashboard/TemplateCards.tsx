import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { TemplateInfo } from '../../types/document';

const BRAND = {
  neon: '#4F80FF',
  accent2: '#3A6AEF',
  violet: '#A855F7',
  rosa: '#FF4EDB',
  lima: '#B2FF3A',
  naranja: '#FF7A45',
} as const;

function glow(hex: string, alpha = 0.45) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Mismo trazo blanco en todos los covers. */
const STROKE = '#FFFFFF';
const SW = 2.85;

type Visual = {
  category: string;
  accent: string;
  soft: string;
  glow: string;
  vector: 'manifesto' | 'portfolio' | 'cover' | 'magazine' | 'catalog' | 'slide';
};

const VISUALS: Record<string, Visual> = {
  'manifesto-digital': {
    category: 'Manifiesto',
    accent: BRAND.rosa,
    soft: BRAND.violet,
    glow: glow(BRAND.rosa),
    vector: 'manifesto',
  },
  'portfolio-kinetic': {
    category: 'Portfolio',
    accent: BRAND.neon,
    soft: BRAND.accent2,
    glow: glow(BRAND.neon),
    vector: 'portfolio',
  },
  'portada-editorial': {
    category: 'Portada',
    accent: BRAND.violet,
    soft: BRAND.rosa,
    glow: glow(BRAND.violet),
    vector: 'cover',
  },
  'revista-doble': {
    category: 'Revista',
    accent: BRAND.lima,
    soft: '#8FD42A',
    glow: glow(BRAND.lima, 0.35),
    vector: 'magazine',
  },
  'catalogo-producto': {
    category: 'Lookbook',
    accent: BRAND.naranja,
    soft: '#FF9A6A',
    glow: glow(BRAND.naranja),
    vector: 'catalog',
  },
  'presentacion-slide': {
    category: 'Presentación',
    accent: BRAND.accent2,
    soft: BRAND.neon,
    glow: glow(BRAND.accent2),
    vector: 'slide',
  },
};

const FALLBACK: Visual = {
  category: 'Plantilla',
  accent: BRAND.neon,
  soft: BRAND.violet,
  glow: glow(BRAND.neon, 0.3),
  vector: 'cover',
};

const strokeProps = {
  stroke: STROKE,
  strokeWidth: SW,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
};

function FormatVectors({ kind }: { kind: Visual['vector'] }) {
  if (kind === 'magazine') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
        <rect x="18" y="16" width="164" height="108" rx="4" {...strokeProps} />
        <line x1="78" y1="16" x2="78" y2="124" {...strokeProps} />
        <rect x="28" y="28" width="38" height="12" rx="2" {...strokeProps} />
        <rect x="28" y="50" width="38" height="38" rx="3" {...strokeProps} />
        <line x1="28" y1="100" x2="66" y2="100" {...strokeProps} />
        <line x1="28" y1="112" x2="58" y2="112" {...strokeProps} />
        <rect x="90" y="28" width="80" height="14" rx="2" {...strokeProps} />
        <line x1="90" y1="56" x2="170" y2="56" {...strokeProps} />
        <line x1="90" y1="70" x2="170" y2="70" {...strokeProps} />
        <line x1="90" y1="84" x2="152" y2="84" {...strokeProps} />
        <rect x="90" y="98" width="80" height="16" rx="2" {...strokeProps} />
      </svg>
    );
  }

  if (kind === 'portfolio') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
        <rect x="52" y="12" width="96" height="116" rx="4" {...strokeProps} />
        <rect x="64" y="24" width="72" height="58" rx="3" {...strokeProps} />
        <line x1="64" y1="96" x2="136" y2="96" {...strokeProps} />
        <line x1="64" y1="110" x2="112" y2="110" {...strokeProps} />
      </svg>
    );
  }

  if (kind === 'cover') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
        <rect x="24" y="14" width="152" height="112" rx="3" {...strokeProps} />
        <line x1="36" y1="14" x2="36" y2="126" {...strokeProps} />
        <circle cx="138" cy="52" r="32" {...strokeProps} />
        <line x1="48" y1="96" x2="128" y2="96" {...strokeProps} />
        <line x1="48" y1="110" x2="96" y2="110" {...strokeProps} />
      </svg>
    );
  }

  if (kind === 'catalog') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
        <rect x="18" y="18" width="74" height="104" rx="4" {...strokeProps} />
        <rect x="108" y="18" width="74" height="104" rx="4" {...strokeProps} />
        <rect x="30" y="30" width="50" height="50" rx="3" {...strokeProps} />
        <rect x="120" y="30" width="50" height="50" rx="3" {...strokeProps} />
        <line x1="30" y1="94" x2="80" y2="94" {...strokeProps} />
        <line x1="30" y1="108" x2="68" y2="108" {...strokeProps} />
        <line x1="120" y1="94" x2="170" y2="94" {...strokeProps} />
        <line x1="120" y1="108" x2="158" y2="108" {...strokeProps} />
      </svg>
    );
  }

  if (kind === 'slide') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
        <rect x="16" y="28" width="168" height="84" rx="4" {...strokeProps} />
        <line x1="34" y1="52" x2="118" y2="52" {...strokeProps} />
        <line x1="34" y1="70" x2="100" y2="70" {...strokeProps} />
        <circle cx="154" cy="70" r="16" {...strokeProps} />
        <path d="M148 60 L166 70 L148 80 Z" {...strokeProps} />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
      <rect x="18" y="16" width="164" height="108" rx="3" {...strokeProps} />
      <line x1="18" y1="16" x2="128" y2="124" {...strokeProps} />
      <line x1="34" y1="36" x2="112" y2="36" {...strokeProps} />
      <line x1="34" y1="54" x2="98" y2="54" {...strokeProps} />
      <line x1="34" y1="72" x2="86" y2="72" {...strokeProps} />
      <rect x="34" y="96" width="48" height="16" rx="8" {...strokeProps} />
      <circle cx="150" cy="46" r="26" {...strokeProps} />
    </svg>
  );
}

/** Color plano + degradado suave en movimiento. */
function FlatMotionField({ accent, soft }: { accent: string; soft: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: accent }} />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${soft} 55%, ${accent} 100%)`,
        }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-1/4 -top-1/3 h-[90%] w-[80%] rounded-full opacity-35 blur-3xl"
        style={{ background: soft }}
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10" />
    </>
  );
}

function cardShell(selected: boolean, accent?: string, accentGlow?: string) {
  return cn(
    'group relative flex h-full flex-col overflow-hidden rounded-xl border text-left transition duration-250',
    selected
      ? 'border-white/35 bg-ink-2'
      : 'border-white/10 bg-ink-2/80 hover:-translate-y-0.5 hover:border-white/22',
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
      className={cardShell(selected)}
      style={
        selected
          ? { boxShadow: `0 0 0 1px ${BRAND.neon}66, 0 18px 40px ${glow(BRAND.neon, 0.28)}` }
          : undefined
      }
    >
      <div className="relative aspect-[5/3] overflow-hidden bg-[#0a0e14]">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(79,128,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(79,128,255,0.35)_1px,transparent_1px)] [background-size:20px_20px]" />
        <svg className="absolute inset-0 h-full w-full p-5" viewBox="0 0 200 140" fill="none" aria-hidden>
          <rect x="40" y="28" width="120" height="84" rx="4" {...strokeProps} strokeDasharray="8 8" />
          <line x1="100" y1="52" x2="100" y2="88" {...strokeProps} />
          <line x1="82" y1="70" x2="118" y2="70" {...strokeProps} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={cn('text-paper/55 transition group-hover:text-neon', selected && 'text-neon')}
            size={22}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 py-3.5">
        <p className="text-[1.05rem] font-semibold tracking-[-0.015em] text-paper">En blanco</p>
        <p className="text-[0.95rem] text-paper/70">Canvas vacío · 1080×1350</p>
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

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cardShell(selected, visual.accent, visual.glow)}
      style={
        selected
          ? { boxShadow: `0 0 0 1px ${visual.accent}77, 0 18px 44px ${visual.glow}` }
          : undefined
      }
    >
      <div className="relative aspect-[5/3] overflow-hidden" style={{ background: visual.accent }}>
        <FlatMotionField accent={visual.accent} soft={visual.soft} />
        <div className="absolute inset-0 p-4 sm:p-5">
          <FormatVectors kind={visual.vector} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-3.5">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: visual.accent, boxShadow: `0 0 10px ${visual.glow}` }}
          />
          <p className="text-[0.95rem] font-medium text-paper/75">{visual.category}</p>
          <p className="ml-auto font-mono text-sm tabular-nums text-paper/55">
            {template.width}×{template.height}
          </p>
        </div>
        <p className="text-[1.1rem] font-semibold leading-snug tracking-[-0.015em] text-paper">
          {template.name}
        </p>
        <p className="mt-1 line-clamp-2 text-[0.95rem] leading-relaxed text-paper/72">
          {template.description}
        </p>
      </div>
    </button>
  );
}

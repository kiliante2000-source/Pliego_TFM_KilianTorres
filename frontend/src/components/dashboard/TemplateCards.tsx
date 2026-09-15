import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { TemplateInfo } from '../../types/document';

/** Colores corporativos PLIEGO */
const BRAND = {
  neon: '#4F80FF',
  accent2: '#3A6AEF',
  violet: '#A855F7',
  rosa: '#FF4EDB',
  lima: '#B2FF3A',
  naranja: '#FF7A45',
} as const;

function glow(hex: string, alpha = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Trazo único: blanco sólido, mismo peso, bien visible. */
const STROKE = '#FFFFFF';
const SW = 2.85;

type Visual = {
  category: string;
  index: string;
  accent: string;
  soft: string;
  glow: string;
  vector: 'manifesto' | 'portfolio' | 'cover' | 'magazine' | 'catalog' | 'slide';
};

const VISUALS: Record<string, Visual> = {
  'manifesto-digital': {
    category: 'Manifiesto',
    index: '01',
    accent: BRAND.rosa,
    soft: BRAND.violet,
    glow: glow(BRAND.rosa, 0.55),
    vector: 'manifesto',
  },
  'portfolio-kinetic': {
    category: 'Portfolio',
    index: '02',
    accent: BRAND.neon,
    soft: BRAND.accent2,
    glow: glow(BRAND.neon, 0.55),
    vector: 'portfolio',
  },
  'portada-editorial': {
    category: 'Portada',
    index: '03',
    accent: BRAND.violet,
    soft: BRAND.rosa,
    glow: glow(BRAND.violet, 0.55),
    vector: 'cover',
  },
  'revista-doble': {
    category: 'Revista',
    index: '04',
    accent: BRAND.lima,
    soft: '#8FD42A',
    glow: glow(BRAND.lima, 0.42),
    vector: 'magazine',
  },
  'catalogo-producto': {
    category: 'Lookbook',
    index: '05',
    accent: BRAND.naranja,
    soft: '#FF9A6A',
    glow: glow(BRAND.naranja, 0.5),
    vector: 'catalog',
  },
  'presentacion-slide': {
    category: 'Presentación',
    index: '06',
    accent: BRAND.accent2,
    soft: BRAND.neon,
    glow: glow(BRAND.accent2, 0.5),
    vector: 'slide',
  },
};

const FALLBACK: Visual = {
  category: 'Plantilla',
  index: '00',
  accent: BRAND.neon,
  soft: BRAND.violet,
  glow: glow(BRAND.neon, 0.35),
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

/** Fondo plano de marca + wash en movimiento. */
function LivingField({ accent, soft }: { accent: string; soft: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: accent }} />
      <motion.div
        className="absolute -inset-[30%]"
        style={{
          background: `linear-gradient(125deg, ${accent} 0%, ${soft} 42%, ${accent} 78%)`,
        }}
        animate={{ x: ['-8%', '8%', '-8%'], y: ['-4%', '6%', '-4%'] }}
        transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-[15%] -top-[25%] h-[85%] w-[70%] rounded-full opacity-40 blur-3xl"
        style={{ background: soft }}
        animate={{ x: [0, -28, 0], y: [0, 22, 0] }}
        transition={{ duration: 11, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-[30%] -left-[20%] h-[70%] w-[65%] rounded-full opacity-28 blur-3xl"
        style={{ background: accent }}
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 13, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/14" />
      {/* Scan digital sutil */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-white/25 via-white/5 to-transparent"
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 4.8, ease: 'linear', repeat: Infinity, repeatDelay: 1.6 }}
      />
    </>
  );
}

/** Esquinas HUD — lenguaje digital sin tapar el vector. */
function HudCorners({ color = 'rgba(255,255,255,0.7)' }: { color?: string }) {
  const arm = 14;
  const t = 2;
  return (
    <svg className="pointer-events-none absolute inset-2.5" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <path d={`M0 0 H${arm} M0 0 V${arm}`} stroke={color} strokeWidth={t} fill="none" vectorEffect="non-scaling-stroke" />
      <path d={`M100 0 H${100 - arm} M100 0 V${arm}`} stroke={color} strokeWidth={t} fill="none" vectorEffect="non-scaling-stroke" />
      <path d={`M0 100 H${arm} M0 100 V${100 - arm}`} stroke={color} strokeWidth={t} fill="none" vectorEffect="non-scaling-stroke" />
      <path d={`M100 100 H${100 - arm} M100 100 V${100 - arm}`} stroke={color} strokeWidth={t} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function CardMeta({
  category,
  accent,
  accentGlow,
  title,
  description,
  size,
}: {
  category: string;
  accent: string;
  accentGlow: string;
  title: string;
  description?: string;
  size: string;
}) {
  return (
    <div className="relative flex flex-1 flex-col bg-[#080b10] px-4 pb-4 pt-3.5">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent 70%)`,
          boxShadow: `0 0 18px ${accentGlow}`,
        }}
      />
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-2 rounded-sm px-2 py-1 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-ink"
          style={{ background: accent, boxShadow: `0 0 20px ${accentGlow}` }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ink/80" />
          {category}
        </span>
        <p className="shrink-0 font-mono text-sm tabular-nums text-paper/70">{size}</p>
      </div>

      {/* DM Sans legible — no Syne display en títulos de card */}
      <p className="text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] text-paper sm:text-[1.2rem]">
        {title}
      </p>
      {description ? (
        <p className="mt-1.5 line-clamp-2 text-[0.98rem] leading-relaxed text-paper/80">{description}</p>
      ) : null}
    </div>
  );
}

function CoverStage({
  children,
  index,
  blank,
}: {
  children: React.ReactNode;
  index: string;
  blank?: boolean;
}) {
  return (
    <div className={cn('relative h-44 overflow-hidden', blank && 'bg-[#070a10]')}>
      {children}
      <span className="pointer-events-none absolute right-2.5 top-1.5 select-none font-mono text-3xl font-bold tabular-nums tracking-tight text-white/20">
        {index}
      </span>
      <HudCorners />
      <div className="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
        <span className="h-1 w-8 rounded-full bg-white/35" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">live</span>
      </div>
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
        'group relative flex h-full flex-col overflow-hidden rounded-sm border text-left transition duration-300',
        selected
          ? 'border-neon/70 bg-ink-2 shadow-[0_18px_44px_rgba(79,128,255,0.28)] ring-1 ring-neon/40'
          : 'border-white/10 bg-ink-2/70 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_20px_48px_rgba(0,0,0,0.4)]',
      )}
    >
      <CoverStage index="00" blank>
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(79,128,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(79,128,255,0.4)_1px,transparent_1px)] [background-size:18px_18px]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/30 blur-2xl"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.85, 1.2, 0.85] }}
          transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-3 overflow-hidden sm:inset-4"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
            <rect x="36" y="24" width="128" height="92" rx="4" {...strokeProps} strokeDasharray="7 7" />
            <line x1="100" y1="52" x2="100" y2="88" {...strokeProps} />
            <line x1="82" y1="70" x2="118" y2="70" {...strokeProps} />
          </svg>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={cn(
              'text-paper/65 transition group-hover:text-neon',
              selected && 'text-neon',
            )}
            size={22}
          />
        </div>
      </CoverStage>
      <CardMeta
        category="Canvas"
        accent={BRAND.neon}
        accentGlow={glow(BRAND.neon, 0.45)}
        title="En blanco"
        size="1080×1350"
      />
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
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-sm border text-left transition duration-300',
        selected
          ? 'border-white/40'
          : 'border-white/10 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_20px_48px_rgba(0,0,0,0.4)]',
      )}
      style={
        selected
          ? {
              boxShadow: `0 0 0 1px ${visual.accent}88, 0 24px 56px ${visual.glow}`,
            }
          : undefined
      }
    >
      <CoverStage index={visual.index}>
        <div className="absolute inset-0" style={{ background: visual.accent }}>
          <LivingField accent={visual.accent} soft={visual.soft} />
        </div>
        <motion.div
          className="absolute inset-3 overflow-hidden sm:inset-4"
          initial={false}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <FormatVectors kind={visual.vector} />
        </motion.div>
      </CoverStage>

      <CardMeta
        category={visual.category}
        accent={visual.accent}
        accentGlow={visual.glow}
        title={template.name}
        description={template.description}
        size={`${template.width}×${template.height}`}
      />
    </button>
  );
}

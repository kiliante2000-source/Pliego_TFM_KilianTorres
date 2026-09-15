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

function glow(hex: string, alpha = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
    glow: glow(BRAND.rosa),
    vector: 'manifesto',
  },
  'portfolio-kinetic': {
    category: 'Portfolio',
    index: '02',
    accent: BRAND.neon,
    soft: BRAND.accent2,
    glow: glow(BRAND.neon),
    vector: 'portfolio',
  },
  'portada-editorial': {
    category: 'Portada',
    index: '03',
    accent: BRAND.violet,
    soft: BRAND.rosa,
    glow: glow(BRAND.violet),
    vector: 'cover',
  },
  'revista-doble': {
    category: 'Revista',
    index: '04',
    accent: BRAND.lima,
    soft: '#9AE835',
    glow: glow(BRAND.lima, 0.38),
    vector: 'magazine',
  },
  'catalogo-producto': {
    category: 'Lookbook',
    index: '05',
    accent: BRAND.naranja,
    soft: '#FF9A6A',
    glow: glow(BRAND.naranja),
    vector: 'catalog',
  },
  'presentacion-slide': {
    category: 'Presentación',
    index: '06',
    accent: BRAND.accent2,
    soft: BRAND.neon,
    glow: glow(BRAND.accent2),
    vector: 'slide',
  },
};

const FALLBACK: Visual = {
  category: 'Plantilla',
  index: '00',
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

/** Campo de marca con movimiento — limpio pero con presencia. */
function BrandField({ accent, soft }: { accent: string; soft: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: accent }} />
      <motion.div
        className="absolute -inset-[40%]"
        style={{
          background: `linear-gradient(120deg, ${accent} 15%, ${soft} 48%, ${accent} 82%)`,
        }}
        animate={{ x: ['-10%', '10%', '-10%'], y: ['-6%', '8%', '-6%'] }}
        transition={{ duration: 11, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-[20%] top-[-30%] h-[95%] w-[75%] rounded-full opacity-50 blur-3xl"
        style={{ background: soft }}
        animate={{ x: [0, -24, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-[35%] -left-[25%] h-[80%] w-[70%] rounded-full opacity-35 blur-3xl"
        style={{ background: '#ffffff' }}
        animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
      />
      {/* Plano tipográfico: franja inferior para anclar el vector */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
    </>
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
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border text-left transition duration-300',
        selected
          ? 'border-neon/60 bg-ink-2 shadow-[0_20px_50px_rgba(79,128,255,0.25)]'
          : 'border-white/10 bg-ink-2/70 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#090d13]">
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(79,128,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(79,128,255,0.45)_1px,transparent_1px)] [background-size:22px_22px]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/35 blur-3xl"
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <svg className="h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
            <rect x="40" y="28" width="120" height="84" rx="6" {...strokeProps} strokeDasharray="8 8" />
            <line x1="100" y1="52" x2="100" y2="88" {...strokeProps} />
            <line x1="82" y1="70" x2="118" y2="70" {...strokeProps} />
          </svg>
        </div>
        <Sparkles
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-paper/50 transition group-hover:text-neon',
            selected && 'text-neon',
          )}
          size={24}
        />
        <span className="absolute left-4 top-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-neon/80">
          Start
        </span>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <p className="text-[1.15rem] font-semibold tracking-[-0.02em] text-paper">En blanco</p>
        <p className="mt-1 text-[0.95rem] leading-relaxed text-paper/70">
          Lienzo libre · 1080×1350
        </p>
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
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border text-left transition duration-300',
        selected
          ? 'border-white/40 bg-ink-2'
          : 'border-white/10 bg-ink-2/70 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]',
      )}
      style={
        selected
          ? { boxShadow: `0 0 0 1px ${visual.accent}88, 0 22px 56px ${visual.glow}` }
          : undefined
      }
    >
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: visual.accent }}>
        <BrandField accent={visual.accent} soft={visual.soft} />

        {/* Índice grande, solo atmósfera */}
        <span className="pointer-events-none absolute -right-1 top-0 select-none font-mono text-7xl font-bold leading-none tracking-tighter text-white/[0.16]">
          {visual.index}
        </span>

        {/* Escenario del vector — panel flotante */}
        <motion.div
          className="absolute inset-4 overflow-hidden rounded-xl border border-white/25 bg-black/15 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-[2px] sm:inset-5"
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 p-2">
            <FormatVectors kind={visual.vector} />
          </div>
        </motion.div>
      </div>

      {/* Meta: acento de color + tipografía legible */}
      <div className="relative flex flex-1 flex-col px-4 py-4">
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, ${visual.accent}, transparent)`,
          }}
        />
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p
            className="text-[0.95rem] font-semibold tracking-[-0.01em]"
            style={{ color: visual.accent }}
          >
            {visual.category}
          </p>
          <p className="font-mono text-sm tabular-nums text-paper/55">
            {template.width}×{template.height}
          </p>
        </div>
        <p className="text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-paper">
          {template.name}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[0.95rem] leading-relaxed text-paper/72">
          {template.description}
        </p>
      </div>
    </button>
  );
}

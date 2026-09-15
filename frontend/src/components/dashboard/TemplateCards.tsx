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

/** Trazo único para todos los covers: blanco sólido, mismo peso, bien visible. */
const STROKE = '#FFFFFF';
const SW = 2.85;

type Visual = {
  category: string;
  index: string;
  accent: string;
  mesh: [string, string, string];
  glow: string;
  vector: 'manifesto' | 'portfolio' | 'cover' | 'magazine' | 'catalog' | 'slide';
};

const VISUALS: Record<string, Visual> = {
  'manifesto-digital': {
    category: 'Manifiesto',
    index: '01',
    accent: BRAND.rosa,
    mesh: [BRAND.rosa, BRAND.violet, BRAND.neon],
    glow: glow(BRAND.rosa, 0.55),
    vector: 'manifesto',
  },
  'portfolio-kinetic': {
    category: 'Portfolio',
    index: '02',
    accent: BRAND.neon,
    mesh: [BRAND.neon, BRAND.accent2, BRAND.violet],
    glow: glow(BRAND.neon, 0.55),
    vector: 'portfolio',
  },
  'portada-editorial': {
    category: 'Portada',
    index: '03',
    accent: BRAND.violet,
    mesh: [BRAND.violet, BRAND.rosa, BRAND.neon],
    glow: glow(BRAND.violet, 0.55),
    vector: 'cover',
  },
  'revista-doble': {
    category: 'Revista',
    index: '04',
    accent: BRAND.lima,
    mesh: [BRAND.lima, '#9AE835', BRAND.neon],
    glow: glow(BRAND.lima, 0.42),
    vector: 'magazine',
  },
  'catalogo-producto': {
    category: 'Lookbook',
    index: '05',
    accent: BRAND.naranja,
    mesh: [BRAND.naranja, '#FF9A6A', BRAND.rosa],
    glow: glow(BRAND.naranja, 0.5),
    vector: 'catalog',
  },
  'presentacion-slide': {
    category: 'Presentación',
    index: '06',
    accent: BRAND.accent2,
    mesh: [BRAND.accent2, BRAND.neon, BRAND.violet],
    glow: glow(BRAND.accent2, 0.5),
    vector: 'slide',
  },
};

const FALLBACK: Visual = {
  category: 'Plantilla',
  index: '00',
  accent: BRAND.neon,
  mesh: [BRAND.neon, BRAND.violet, BRAND.rosa],
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

/**
 * Composiciones tipográficas/layout — mismo grosor blanco en todos.
 * Asimétricas, editoriales, sin texto.
 */
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
        <rect x="22" y="28" width="78" height="92" rx="5" {...strokeProps} />
        <rect x="48" y="18" width="90" height="92" rx="5" {...strokeProps} />
        <rect x="78" y="30" width="100" height="86" rx="5" {...strokeProps} />
        <line x1="96" y1="88" x2="158" y2="88" {...strokeProps} />
        <line x1="96" y1="102" x2="142" y2="102" {...strokeProps} />
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

  // manifesto — diagonal + display blocks + orb
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

/** Campo de color vivo — digital, con profundidad. */
function LivingField({ colors, accent }: { colors: [string, string, string]; accent: string }) {
  const [a, b, c] = colors;
  return (
    <>
      <div className="absolute inset-0" style={{ background: accent }} />
      <motion.div
        className="absolute -inset-[70%] opacity-90 mix-blend-soft-light"
        style={{
          background: `conic-gradient(from 140deg at 38% 42%, ${a}, ${b}, ${c}, ${a})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        className="absolute -left-[20%] -top-[35%] h-[130%] w-[90%] rounded-full opacity-75 blur-3xl mix-blend-screen"
        style={{ background: b }}
        animate={{ x: [0, 36, -18, 0], y: [0, -24, 16, 0] }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-[40%] -right-[25%] h-[120%] w-[80%] rounded-full opacity-60 blur-3xl mix-blend-screen"
        style={{ background: c }}
        animate={{ x: [0, -28, 20, 0], y: [0, 18, -26, 0] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />
      {/* Plano editorial: franja diagonal oscura para contraste del vector */}
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(5,6,8,0.15)_0%,transparent_42%,rgba(5,6,8,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.22),transparent_50%)]" />
    </>
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
    <div className="relative flex flex-1 flex-col border-t border-white/8 bg-ink-2 px-4 pb-4 pt-3.5">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
        style={{ background: accent, boxShadow: `0 0 16px ${accentGlow}` }}
      />
      <div className="mb-1.5 flex items-center justify-between gap-2 pl-1">
        <p className="font-mono text-base uppercase tracking-[0.14em] text-paper/80">{category}</p>
        <p className="shrink-0 font-mono text-sm tabular-nums text-paper/65">{size}</p>
      </div>
      <p className="pl-1 font-display text-xl font-extrabold leading-tight tracking-[-0.04em] text-paper">
        {title}
      </p>
      {description ? (
        <p className="mt-2 line-clamp-2 pl-1 text-base leading-relaxed text-paper/78">{description}</p>
      ) : null}
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
          : 'border-white/10 bg-ink-2/70 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]',
      )}
    >
      <div className="relative h-44 overflow-hidden bg-[#0a0e14]">
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(79,128,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(79,128,255,0.35)_1px,transparent_1px)] [background-size:20px_20px]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/25 blur-2xl"
          animate={{ opacity: [0.3, 0.75, 0.3], scale: [0.85, 1.2, 0.85] }}
          transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 140" fill="none" aria-hidden>
          <rect x="36" y="24" width="128" height="92" rx="4" {...strokeProps} strokeDasharray="7 7" />
          <line x1="100" y1="52" x2="100" y2="88" {...strokeProps} />
          <line x1="82" y1="70" x2="118" y2="70" {...strokeProps} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={cn(
              'text-paper/60 transition group-hover:text-neon',
              selected && 'text-neon',
            )}
            size={22}
          />
        </div>
        <span className="absolute right-3 top-2 font-display text-4xl font-extrabold tracking-tighter text-white/12">
          00
        </span>
      </div>
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
          : 'border-white/10 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]',
      )}
      style={
        selected
          ? {
              boxShadow: `0 0 0 1px ${visual.accent}77, 0 22px 52px ${visual.glow}`,
            }
          : undefined
      }
    >
      <div className="relative h-44 overflow-hidden" style={{ background: visual.accent }}>
        <LivingField colors={visual.mesh} accent={visual.accent} />

        {/* Índice fantasma — ritmo editorial, no es el nombre del tipo */}
        <span className="pointer-events-none absolute -right-1 -top-1 select-none font-display text-6xl font-extrabold leading-none tracking-tighter text-white/[0.14]">
          {visual.index}
        </span>

        {/* Escenario del vector: mismo peso blanco en todas */}
        <motion.div
          className="absolute inset-3 overflow-hidden rounded-[2px] border border-white/20 bg-black/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-[1px] sm:inset-4"
          initial={false}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <FormatVectors kind={visual.vector} />
        </motion.div>
      </div>

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

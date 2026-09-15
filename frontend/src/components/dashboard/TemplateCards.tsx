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
  ink: '#050608',
  paper: '#F4F6F8',
} as const;

function glow(hex: string, alpha = 0.5) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Visual = {
  category: string;
  accent: string;
  mesh: [string, string, string];
  glow: string;
  vector: 'manifesto' | 'portfolio' | 'cover' | 'magazine' | 'catalog' | 'slide';
};

const VISUALS: Record<string, Visual> = {
  'manifesto-digital': {
    category: 'Manifiesto',
    accent: BRAND.rosa,
    mesh: [BRAND.rosa, BRAND.violet, BRAND.neon],
    glow: glow(BRAND.rosa, 0.55),
    vector: 'manifesto',
  },
  'portfolio-kinetic': {
    category: 'Portfolio',
    accent: BRAND.neon,
    mesh: [BRAND.neon, BRAND.accent2, BRAND.violet],
    glow: glow(BRAND.neon, 0.55),
    vector: 'portfolio',
  },
  'portada-editorial': {
    category: 'Portada',
    accent: BRAND.violet,
    mesh: [BRAND.violet, BRAND.rosa, BRAND.neon],
    glow: glow(BRAND.violet, 0.55),
    vector: 'cover',
  },
  'revista-doble': {
    category: 'Revista',
    accent: BRAND.lima,
    mesh: [BRAND.lima, '#8FD42A', BRAND.neon],
    glow: glow(BRAND.lima, 0.4),
    vector: 'magazine',
  },
  'catalogo-producto': {
    category: 'Lookbook',
    accent: BRAND.naranja,
    mesh: [BRAND.naranja, '#FF9A6A', BRAND.rosa],
    glow: glow(BRAND.naranja, 0.5),
    vector: 'catalog',
  },
  'presentacion-slide': {
    category: 'Presentación',
    accent: BRAND.accent2,
    mesh: [BRAND.accent2, BRAND.neon, BRAND.violet],
    glow: glow(BRAND.accent2, 0.5),
    vector: 'slide',
  },
};

const FALLBACK: Visual = {
  category: 'Plantilla',
  accent: BRAND.neon,
  mesh: [BRAND.neon, BRAND.violet, BRAND.rosa],
  glow: glow(BRAND.neon, 0.35),
  vector: 'cover',
};

/** Wireframe del formato — solo geometría, sin tipografía en el cover. */
function FormatVectors({ kind }: { kind: Visual['vector'] }) {
  const stroke = 'rgba(255,255,255,0.88)';
  const soft = 'rgba(255,255,255,0.35)';

  if (kind === 'magazine') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="14" y="12" width="132" height="88" rx="3" stroke={soft} strokeWidth="1.4" />
        <line x1="52" y1="12" x2="52" y2="100" stroke={stroke} strokeWidth="1.6" />
        <rect x="20" y="20" width="26" height="8" rx="1" stroke={stroke} strokeWidth="1.3" />
        <rect x="20" y="34" width="26" height="26" rx="2" stroke={soft} strokeWidth="1.2" />
        <rect x="20" y="66" width="26" height="4" rx="1" stroke={soft} strokeWidth="1.2" />
        <rect x="20" y="74" width="26" height="4" rx="1" stroke={soft} strokeWidth="1.2" />
        <rect x="20" y="82" width="18" height="4" rx="1" stroke={soft} strokeWidth="1.2" />
        <rect x="60" y="20" width="78" height="10" rx="1.5" stroke={stroke} strokeWidth="1.5" />
        <rect x="60" y="36" width="78" height="3" rx="1" stroke={soft} strokeWidth="1.2" />
        <rect x="60" y="44" width="78" height="3" rx="1" stroke={soft} strokeWidth="1.2" />
        <rect x="60" y="52" width="62" height="3" rx="1" stroke={soft} strokeWidth="1.2" />
        <rect x="60" y="64" width="78" height="28" rx="2" stroke={stroke} strokeWidth="1.4" />
      </svg>
    );
  }

  if (kind === 'portfolio') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="18" y="18" width="70" height="76" rx="4" stroke={soft} strokeWidth="1.4" />
        <rect x="28" y="28" width="88" height="68" rx="4" stroke={soft} strokeWidth="1.3" />
        <rect x="40" y="22" width="96" height="72" rx="4" stroke={stroke} strokeWidth="1.7" />
        <line x1="52" y1="72" x2="112" y2="72" stroke={stroke} strokeWidth="1.4" />
        <line x1="52" y1="82" x2="96" y2="82" stroke={soft} strokeWidth="1.3" />
      </svg>
    );
  }

  if (kind === 'cover') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="16" y="10" width="128" height="92" rx="2" stroke={soft} strokeWidth="1.3" />
        <circle cx="108" cy="42" r="28" stroke={stroke} strokeWidth="1.7" />
        <line x1="28" y1="78" x2="100" y2="78" stroke={stroke} strokeWidth="2" />
        <line x1="28" y1="88" x2="72" y2="88" stroke={soft} strokeWidth="1.4" />
        <line x1="22" y1="10" x2="22" y2="102" stroke={stroke} strokeWidth="2.2" />
      </svg>
    );
  }

  if (kind === 'catalog') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="16" y="14" width="58" height="84" rx="3" stroke={stroke} strokeWidth="1.5" />
        <rect x="86" y="14" width="58" height="84" rx="3" stroke={stroke} strokeWidth="1.5" />
        <rect x="24" y="22" width="42" height="42" rx="2" stroke={soft} strokeWidth="1.3" />
        <rect x="94" y="22" width="42" height="42" rx="2" stroke={soft} strokeWidth="1.3" />
        <line x1="24" y1="74" x2="58" y2="74" stroke={soft} strokeWidth="1.3" />
        <line x1="24" y1="84" x2="48" y2="84" stroke={soft} strokeWidth="1.3" />
        <line x1="94" y1="74" x2="128" y2="74" stroke={soft} strokeWidth="1.3" />
        <line x1="94" y1="84" x2="118" y2="84" stroke={soft} strokeWidth="1.3" />
      </svg>
    );
  }

  if (kind === 'slide') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="12" y="22" width="136" height="68" rx="3" stroke={stroke} strokeWidth="1.6" />
        <line x1="28" y1="42" x2="100" y2="42" stroke={stroke} strokeWidth="2.2" />
        <line x1="28" y1="56" x2="86" y2="56" stroke={soft} strokeWidth="1.5" />
        <circle cx="128" cy="56" r="11" stroke={soft} strokeWidth="1.4" />
        <path d="M124 50 L136 56 L124 62 Z" stroke={stroke} strokeWidth="1.4" fill="none" />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
      <rect x="14" y="12" width="132" height="88" rx="2" stroke={soft} strokeWidth="1.3" />
      <line x1="14" y1="12" x2="100" y2="100" stroke={stroke} strokeWidth="1.5" />
      <line x1="28" y1="28" x2="90" y2="28" stroke={stroke} strokeWidth="2.4" />
      <line x1="28" y1="42" x2="78" y2="42" stroke={stroke} strokeWidth="2.4" />
      <line x1="28" y1="56" x2="70" y2="56" stroke={stroke} strokeWidth="2.4" />
      <rect x="28" y="74" width="40" height="12" rx="6" stroke={stroke} strokeWidth="1.4" />
      <circle cx="122" cy="36" r="22" stroke={soft} strokeWidth="1.4" />
    </svg>
  );
}

/** Mesh vivo de marca — atmósfera editorial, sin textos encima. */
function LivingMesh({ colors, accent }: { colors: [string, string, string]; accent: string }) {
  const [a, b, c] = colors;
  return (
    <>
      <div className="absolute inset-0" style={{ background: accent }} />
      <motion.div
        className="absolute -inset-[60%] opacity-[0.85] mix-blend-soft-light"
        style={{
          background: `conic-gradient(from 110deg at 42% 48%, ${a}, ${b}, ${c}, ${a})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        className="absolute -left-1/3 -top-1/2 h-[150%] w-[95%] rounded-full opacity-70 blur-3xl mix-blend-screen"
        style={{ background: b }}
        animate={{ x: [0, 28, -14, 0], y: [0, -20, 12, 0], scale: [1, 1.06, 0.96, 1] }}
        transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/3 h-[140%] w-[85%] rounded-full opacity-55 blur-3xl mix-blend-screen"
        style={{ background: c }}
        animate={{ x: [0, -22, 16, 0], y: [0, 14, -22, 0], scale: [1, 0.94, 1.08, 1] }}
        transition={{ duration: 11, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-black/35" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:22px_22px]" />
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
        'group relative flex h-full flex-col overflow-hidden rounded-sm border text-left transition duration-300',
        selected
          ? 'border-neon/70 bg-ink-2 shadow-[0_16px_40px_rgba(79,128,255,0.22)] ring-1 ring-neon/35'
          : 'border-white/10 bg-ink-2/60 hover:border-white/22',
      )}
    >
      <div className="relative h-40 overflow-hidden bg-[#0d1218]">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(79,128,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(79,128,255,0.3)_1px,transparent_1px)] [background-size:18px_18px]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/20 blur-2xl"
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 128" fill="none" aria-hidden>
          <rect
            x="28"
            y="24"
            width="104"
            height="80"
            rx="3"
            stroke="rgba(79,128,255,0.55)"
            strokeWidth="1.4"
            strokeDasharray="5 5"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={cn(
              'text-paper/55 transition group-hover:text-neon',
              selected && 'text-neon',
            )}
            size={26}
          />
        </div>
      </div>
      <div
        className="h-1 w-full"
        style={{
          background: 'linear-gradient(90deg, #4F80FF, #FF4EDB, #A855F7)',
        }}
      />
      <div className="flex flex-1 flex-col bg-ink-2 p-4">
        <p className="font-mono text-base uppercase tracking-[0.14em] text-paper/70">Canvas</p>
        <p className="mt-1 text-lg font-semibold leading-snug tracking-[-0.02em] text-paper">
          En blanco
        </p>
        <p className="mt-2 font-mono text-base text-paper/65">1080 × 1350</p>
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
        'group relative flex h-full flex-col overflow-hidden rounded-sm border text-left transition duration-300',
        selected ? 'border-white/35' : 'border-white/10 hover:border-white/22',
      )}
      style={
        selected
          ? {
              boxShadow: `0 0 0 1px ${visual.accent}66, 0 20px 48px ${visual.glow}`,
            }
          : undefined
      }
    >
      <div className="relative h-40 overflow-hidden" style={{ background: visual.accent }}>
        <LivingMesh colors={visual.mesh} accent={visual.accent} />
        <motion.div
          className="absolute inset-0"
          initial={false}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <FormatVectors kind={visual.vector} />
        </motion.div>
      </div>

      <div className="h-1 w-full" style={{ background: visual.accent }} />

      <div className="relative flex flex-1 flex-col bg-ink-2 p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: visual.accent, boxShadow: `0 0 12px ${visual.glow}` }}
            />
            <p className="font-mono text-base uppercase tracking-[0.14em] text-paper/75">
              {visual.category}
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm tabular-nums text-paper/60">
            {template.width}×{template.height}
          </p>
        </div>
        <p className="text-lg font-semibold leading-snug tracking-[-0.02em] text-paper">
          {template.name}
        </p>
        <p className="mt-2 line-clamp-2 text-base leading-relaxed text-paper/75">
          {template.description}
        </p>
      </div>
    </button>
  );
}

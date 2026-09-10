import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { TemplateInfo } from '../../types/document';

/** Colores exactos de la identidad PLIEGO (index.css) */
const BRAND = {
  neon: '#4F80FF',
  accent2: '#3A6AEF',
  violet: '#A855F7',
  rosa: '#FF4EDB',
  lima: '#B2FF3A',
  naranja: '#FF7A45',
  ink: '#0B0E11',
  paper: '#F4F6F8',
} as const;

function glow(hex: string, alpha = 0.55) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Visual = {
  label: string;
  flat: string;
  glow: string;
  mesh: string[];
  vector: 'manifesto' | 'portfolio' | 'cover' | 'magazine' | 'catalog' | 'slide';
};

/** Un color corporativo protagonista por plantilla; mesh solo con paleta Pliego. */
const VISUALS: Record<string, Visual> = {
  'manifesto-digital': {
    label: 'Editorial digital',
    flat: BRAND.rosa,
    glow: glow(BRAND.rosa),
    mesh: [BRAND.rosa, BRAND.violet, BRAND.neon],
    vector: 'manifesto',
  },
  'portfolio-kinetic': {
    label: 'Editorial digital',
    flat: BRAND.neon,
    glow: glow(BRAND.neon),
    mesh: [BRAND.neon, BRAND.violet, BRAND.rosa],
    vector: 'portfolio',
  },
  'portada-editorial': {
    label: 'Portada',
    flat: BRAND.violet,
    glow: glow(BRAND.violet),
    mesh: [BRAND.violet, BRAND.rosa, BRAND.naranja],
    vector: 'cover',
  },
  'revista-doble': {
    label: 'Revista',
    flat: BRAND.lima,
    glow: glow(BRAND.lima, 0.45),
    mesh: [BRAND.lima, BRAND.neon, BRAND.violet],
    vector: 'magazine',
  },
  'catalogo-producto': {
    label: 'Catálogo',
    flat: BRAND.naranja,
    glow: glow(BRAND.naranja),
    mesh: [BRAND.naranja, BRAND.rosa, BRAND.violet],
    vector: 'catalog',
  },
  'presentacion-slide': {
    label: 'Presentación',
    flat: BRAND.accent2,
    glow: glow(BRAND.accent2),
    mesh: [BRAND.accent2, BRAND.neon, BRAND.violet],
    vector: 'slide',
  },
};

const FALLBACK: Visual = {
  label: 'Plantilla',
  flat: BRAND.neon,
  glow: glow(BRAND.neon, 0.45),
  mesh: [BRAND.neon, BRAND.violet, BRAND.rosa],
  vector: 'cover',
};

/** Wireframes vectoriales que sugieren el formato, sin tipografía ni rellenos pesados. */
function FormatVectors({ kind }: { kind: Visual['vector'] }) {
  const stroke = '#FFFFFF';

  if (kind === 'magazine') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="14" y="12" width="132" height="88" rx="4" stroke={stroke} strokeWidth="2.6" />
        <line x1="52" y1="12" x2="52" y2="100" stroke={stroke} strokeWidth="2.6" />
        <rect x="20" y="20" width="26" height="8" rx="1" stroke={stroke} strokeWidth="2.4" />
        <rect x="20" y="34" width="26" height="26" rx="2" stroke={stroke} strokeWidth="2.4" />
        <rect x="20" y="66" width="26" height="5" rx="1" stroke={stroke} strokeWidth="2.2" />
        <rect x="20" y="76" width="26" height="5" rx="1" stroke={stroke} strokeWidth="2.2" />
        <rect x="20" y="86" width="18" height="5" rx="1" stroke={stroke} strokeWidth="2.2" />
        <rect x="60" y="20" width="78" height="10" rx="1.5" stroke={stroke} strokeWidth="2.6" />
        <rect x="60" y="36" width="78" height="4" rx="1" stroke={stroke} strokeWidth="2.2" />
        <rect x="60" y="46" width="78" height="4" rx="1" stroke={stroke} strokeWidth="2.2" />
        <rect x="60" y="56" width="62" height="4" rx="1" stroke={stroke} strokeWidth="2.2" />
        <rect x="60" y="68" width="78" height="24" rx="2" stroke={stroke} strokeWidth="2.5" />
      </svg>
    );
  }

  if (kind === 'portfolio') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="18" y="18" width="70" height="76" rx="5" stroke={stroke} strokeWidth="2.5" />
        <rect x="28" y="28" width="88" height="68" rx="5" stroke={stroke} strokeWidth="2.4" />
        <rect x="40" y="22" width="96" height="72" rx="5" stroke={stroke} strokeWidth="2.8" />
        <line x1="52" y1="72" x2="112" y2="72" stroke={stroke} strokeWidth="2.4" />
        <line x1="52" y1="82" x2="96" y2="82" stroke={stroke} strokeWidth="2.4" />
      </svg>
    );
  }

  if (kind === 'cover') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="16" y="10" width="128" height="92" rx="3" stroke={stroke} strokeWidth="2.4" />
        <circle cx="108" cy="42" r="28" stroke={stroke} strokeWidth="2.8" />
        <line x1="28" y1="78" x2="100" y2="78" stroke={stroke} strokeWidth="2.8" />
        <line x1="28" y1="88" x2="72" y2="88" stroke={stroke} strokeWidth="2.4" />
        <line x1="22" y1="10" x2="22" y2="102" stroke={stroke} strokeWidth="3" />
      </svg>
    );
  }

  if (kind === 'catalog') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="16" y="14" width="58" height="84" rx="4" stroke={stroke} strokeWidth="2.6" />
        <rect x="86" y="14" width="58" height="84" rx="4" stroke={stroke} strokeWidth="2.6" />
        <rect x="24" y="22" width="42" height="42" rx="2" stroke={stroke} strokeWidth="2.4" />
        <rect x="94" y="22" width="42" height="42" rx="2" stroke={stroke} strokeWidth="2.4" />
        <line x1="24" y1="74" x2="58" y2="74" stroke={stroke} strokeWidth="2.4" />
        <line x1="24" y1="84" x2="48" y2="84" stroke={stroke} strokeWidth="2.4" />
        <line x1="94" y1="74" x2="128" y2="74" stroke={stroke} strokeWidth="2.4" />
        <line x1="94" y1="84" x2="118" y2="84" stroke={stroke} strokeWidth="2.4" />
      </svg>
    );
  }

  if (kind === 'slide') {
    return (
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
        <rect x="12" y="22" width="136" height="68" rx="4" stroke={stroke} strokeWidth="2.8" />
        <line x1="28" y1="42" x2="100" y2="42" stroke={stroke} strokeWidth="3.2" />
        <line x1="28" y1="56" x2="86" y2="56" stroke={stroke} strokeWidth="2.6" />
        <circle cx="128" cy="56" r="11" stroke={stroke} strokeWidth="2.5" />
        <path d="M124 50 L136 56 L124 62 Z" stroke={stroke} strokeWidth="2.4" fill="none" />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 112" fill="none" aria-hidden>
      <rect x="14" y="12" width="132" height="88" rx="3" stroke={stroke} strokeWidth="2.4" />
      <line x1="14" y1="12" x2="100" y2="100" stroke={stroke} strokeWidth="2.4" />
      <line x1="28" y1="28" x2="90" y2="28" stroke={stroke} strokeWidth="3.2" />
      <line x1="28" y1="42" x2="78" y2="42" stroke={stroke} strokeWidth="3.2" />
      <line x1="28" y1="56" x2="70" y2="56" stroke={stroke} strokeWidth="3.2" />
      <rect x="28" y="74" width="40" height="12" rx="6" stroke={stroke} strokeWidth="2.5" />
      <circle cx="122" cy="36" r="22" stroke={stroke} strokeWidth="2.5" />
    </svg>
  );
}

function LivingGradient({ colors }: { colors: string[] }) {
  const [a, b, c] = colors;
  return (
    <>
      <motion.div
        className="absolute -inset-[55%] opacity-90"
        style={{
          background: `conic-gradient(from 90deg at 45% 45%, ${a}, ${b}, ${c}, ${a})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        className="absolute -left-1/3 -top-1/2 h-[150%] w-[90%] rounded-full opacity-75 blur-3xl mix-blend-screen"
        style={{ background: b }}
        animate={{ x: [0, 32, -16, 0], y: [0, -22, 14, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-1/2 -right-1/3 h-[140%] w-[85%] rounded-full opacity-65 blur-3xl mix-blend-screen"
        style={{ background: c }}
        animate={{ x: [0, -26, 18, 0], y: [0, 16, -24, 0], scale: [1, 0.94, 1.1, 1] }}
        transition={{ duration: 9.5, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/25" />
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
        'group relative overflow-hidden rounded-sm border text-left transition',
        selected
          ? 'border-neon/70 bg-ink-2 ring-1 ring-neon/40 shadow-[0_16px_40px_rgba(79,128,255,0.22)]'
          : 'border-white/10 bg-ink-2/60 hover:border-white/25',
      )}
    >
      <div className="relative h-32 overflow-hidden bg-[#12171e]">
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(79,128,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(79,128,255,0.28)_1px,transparent_1px)] [background-size:16px_16px]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 128" fill="none" aria-hidden>
          <rect x="28" y="24" width="104" height="80" rx="3" stroke="rgba(79,128,255,0.45)" strokeWidth="1.2" strokeDasharray="4 4" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles
            className={cn(
              'text-paper-muted transition group-hover:text-neon',
              selected && 'text-neon',
            )}
            size={22}
          />
        </div>
      </div>
      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted">Canvas</p>
        <p className="mt-1 font-display text-sm font-bold tracking-tight text-paper">En blanco</p>
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

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-sm border text-left transition duration-300',
        selected ? 'border-white/35' : 'border-white/10 hover:border-white/20',
      )}
      style={
        selected
          ? {
              boxShadow: `0 0 0 1px ${visual.flat}66, 0 18px 44px ${visual.glow}`,
            }
          : undefined
      }
    >
      <div className="relative h-32 overflow-hidden" style={{ background: visual.flat }}>
        <LivingGradient colors={visual.mesh} />
        <FormatVectors kind={visual.vector} />
      </div>
      <div className="relative bg-ink-2 p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: visual.flat, boxShadow: `0 0 10px ${visual.glow}` }}
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-muted">
            {visual.label}
          </p>
        </div>
        <p className="font-display text-sm font-bold tracking-tight text-paper">{template.name}</p>
        <p className="mt-1 line-clamp-2 font-serif text-xs text-paper/55">{template.description}</p>
      </div>
    </button>
  );
}

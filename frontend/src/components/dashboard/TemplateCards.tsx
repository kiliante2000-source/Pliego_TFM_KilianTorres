import { motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
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

type VectorKind = 'manifesto' | 'portfolio' | 'cover' | 'magazine' | 'catalog' | 'slide';

type PosterVisual = {
  category: string;
  index: string;
  accent: string;
  soft: string;
  glow: string;
  vector: VectorKind;
  tagline: string;
  pages: string;
  motif: string;
};

const POSTERS: Record<string, PosterVisual> = {
  'manifesto-digital': {
    category: 'Manifiesto',
    index: '01',
    accent: '#FF4EDB',
    soft: '#FF9AE8',
    glow: glow('#FF4EDB'),
    vector: 'manifesto',
    tagline: 'Cine · ensayo · CTA',
    pages: '3 págs',
    motif: 'DIAGONAL',
  },
  'portfolio-kinetic': {
    category: 'Portfolio',
    index: '02',
    accent: '#4F80FF',
    soft: '#8BB0FF',
    glow: glow('#4F80FF'),
    vector: 'portfolio',
    tagline: 'Hero tipográfico',
    pages: '2 págs',
    motif: 'STACK',
  },
  'portada-editorial': {
    category: 'Portada',
    index: '03',
    accent: '#A855F7',
    soft: '#C9A0FF',
    glow: glow('#A855F7'),
    vector: 'cover',
    tagline: 'Neón tipográfico',
    pages: '1 pág',
    motif: 'ORBIT',
  },
  'revista-doble': {
    category: 'Revista',
    index: '04',
    accent: '#B2FF3A',
    soft: '#D4FF80',
    glow: glow('#B2FF3A', 0.38),
    vector: 'magazine',
    tagline: 'Spread + motion',
    pages: '1 pág',
    motif: 'COLUMNS',
  },
  'catalogo-producto': {
    category: 'Lookbook',
    index: '05',
    accent: '#FF7A45',
    soft: '#FFB07A',
    glow: glow('#FF7A45'),
    vector: 'catalog',
    tagline: 'Dual lookbook',
    pages: '1 pág',
    motif: 'DUAL',
  },
  'presentacion-slide': {
    category: 'Presentación',
    index: '06',
    accent: '#22D3EE',
    soft: '#67E8F9',
    glow: glow('#22D3EE'),
    vector: 'slide',
    tagline: 'Widescreen display',
    pages: '1 pág',
    motif: 'STAGE',
  },
};

const FALLBACK: PosterVisual = {
  category: 'Plantilla',
  index: '00',
  accent: BRAND.neon,
  soft: BRAND.violet,
  glow: glow(BRAND.neon, 0.3),
  vector: 'cover',
  tagline: 'Estructura PLIEGO',
  pages: '—',
  motif: 'FORM',
};

export type BlankFormatId = 'story' | 'square' | 'landscape' | 'presentation';

export const BLANK_FORMATS: {
  id: BlankFormatId;
  label: string;
  short: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}[] = [
  { id: 'story', label: 'Story', short: '1080×1350', width: 1080, height: 1350, orientation: 'portrait' },
  { id: 'square', label: 'Cuadrado', short: '1080×1080', width: 1080, height: 1080, orientation: 'portrait' },
  { id: 'landscape', label: 'Web', short: '1440×900', width: 1440, height: 900, orientation: 'landscape' },
  { id: 'presentation', label: 'Slide', short: '1920×1080', width: 1920, height: 1080, orientation: 'landscape' },
];

function KineticField({ accent, soft }: { accent: string; soft: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: accent }} />
      <motion.div
        className="absolute -inset-[50%]"
        style={{
          background: `conic-gradient(from 200deg at 42% 38%, ${accent}, ${soft}, rgba(255,255,255,0.55), ${accent})`,
        }}
        animate={{ rotate: [0, 28, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-[28%] top-[-38%] h-[115%] w-[85%] rounded-full opacity-55 blur-3xl"
        style={{ background: soft }}
        animate={{ x: [0, -34, 0], y: [0, 24, 0] }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-[42%] -left-[32%] h-[95%] w-[80%] rounded-full opacity-40 blur-3xl"
        style={{ background: '#fff' }}
        animate={{ x: [0, 22, 0], y: [0, -18, 0] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgba(255,255,255,0.38),transparent_52%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
    </>
  );
}

const SW = 4.25;
const stroke = {
  fill: 'none' as const,
  stroke: '#FFFFFF',
  strokeWidth: SW,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  vectorEffect: 'non-scaling-stroke' as const,
};

/** Diagramas vectoriales PLIEGO — mismo trazo, alto contraste, con motion. */
function VectorArt({ kind }: { kind: VectorKind }) {
  if (kind === 'manifesto') {
    return (
      <motion.svg
        viewBox="0 0 280 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        initial={false}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.line
          x1="36" y1="28" x2="36" y2="172"
          {...stroke}
          animate={{ pathLength: [0.55, 1, 0.55] }}
          transition={{ duration: 3.8, repeat: Infinity }}
        />
        <line x1="52" y1="40" x2="168" y2="40" {...stroke} />
        <line x1="52" y1="62" x2="148" y2="62" {...stroke} />
        <line x1="52" y1="84" x2="132" y2="84" {...stroke} />
        <motion.line
          x1="52" y1="28" x2="220" y2="172"
          {...stroke}
          strokeOpacity={0.55}
          animate={{ pathLength: [0.3, 1, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.circle
          cx="214" cy="56" r="28"
          {...stroke}
          animate={{ rotate: 360 }}
          style={{ originX: '214px', originY: '56px' }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
        />
        <circle cx="214" cy="56" r="8" fill="#fff" />
        <rect x="52" y="148" width="56" height="20" rx="10" {...stroke} />
      </motion.svg>
    );
  }

  if (kind === 'portfolio') {
    return (
      <motion.svg
        viewBox="0 0 220 260"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="48" y="24" width="124" height="212" rx="8" {...stroke} />
        <rect x="64" y="42" width="92" height="72" rx="4" {...stroke} />
        <line x1="64" y1="136" x2="156" y2="136" {...stroke} />
        <line x1="64" y1="152" x2="132" y2="152" {...stroke} />
        <line x1="64" y1="168" x2="120" y2="168" {...stroke} />
        <motion.rect
          x="64" y="196" width="92" height="10" rx="5"
          {...stroke}
          style={{ transformOrigin: '64px 201px' }}
          animate={{ scaleX: [0.45, 1, 0.45] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    );
  }

  if (kind === 'cover') {
    return (
      <motion.svg
        viewBox="0 0 260 220"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <rect x="28" y="24" width="160" height="172" rx="6" {...stroke} />
        <line x1="48" y1="24" x2="48" y2="196" {...stroke} />
        <motion.circle
          cx="188" cy="78" r="46"
          {...stroke}
          animate={{ scale: [1, 1.08, 1] }}
          style={{ originX: '188px', originY: '78px' }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="188" cy="78" r="18" {...stroke} />
        <line x1="60" y1="150" x2="150" y2="150" {...stroke} />
        <line x1="60" y1="168" x2="120" y2="168" {...stroke} />
      </motion.svg>
    );
  }

  if (kind === 'magazine') {
    return (
      <motion.svg
        viewBox="0 0 280 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="20" y="18" width="240" height="164" rx="6" {...stroke} />
        <line x1="110" y1="18" x2="110" y2="182" {...stroke} />
        <rect x="34" y="34" width="60" height="14" rx="2" {...stroke} />
        <rect x="34" y="60" width="60" height="58" rx="3" {...stroke} />
        <line x1="34" y1="136" x2="94" y2="136" {...stroke} />
        <line x1="34" y1="152" x2="80" y2="152" {...stroke} />
        <motion.rect
          x="128" y="34" width="116" height="18" rx="2"
          {...stroke}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />
        <line x1="128" y1="70" x2="244" y2="70" {...stroke} />
        <line x1="128" y1="88" x2="244" y2="88" {...stroke} />
        <line x1="128" y1="106" x2="220" y2="106" {...stroke} />
        <rect x="128" y="130" width="116" height="36" rx="3" {...stroke} />
      </motion.svg>
    );
  }

  if (kind === 'catalog') {
    return (
      <motion.svg
        viewBox="0 0 280 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x="28" y="22" width="100" height="156" rx="6" {...stroke} />
          <rect x="42" y="38" width="72" height="72" rx="3" {...stroke} />
          <line x1="42" y1="128" x2="114" y2="128" {...stroke} />
          <line x1="42" y1="146" x2="96" y2="146" {...stroke} />
        </motion.g>
        <motion.g
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <rect x="152" y="22" width="100" height="156" rx="6" {...stroke} />
          <rect x="166" y="38" width="72" height="72" rx="3" {...stroke} />
          <line x1="166" y1="128" x2="238" y2="128" {...stroke} />
          <line x1="166" y1="146" x2="220" y2="146" {...stroke} />
        </motion.g>
      </motion.svg>
    );
  }

  // slide
  return (
    <motion.svg
      viewBox="0 0 300 180"
      className="absolute inset-0 h-full w-full"
      aria-hidden
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <rect x="18" y="28" width="264" height="124" rx="8" {...stroke} />
      <line x1="40" y1="58" x2="160" y2="58" {...stroke} />
      <line x1="40" y1="78" x2="140" y2="78" {...stroke} />
      <line x1="40" y1="98" x2="120" y2="98" {...stroke} />
      <motion.circle
        cx="230" cy="90" r="26"
        {...stroke}
        animate={{ scale: [1, 1.12, 1] }}
        style={{ originX: '230px', originY: '90px' }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <path d="M222 78 L246 90 L222 102 Z" {...stroke} />
      <motion.line
        x1="18" y1="152" x2="282" y2="152"
        {...stroke}
        strokeOpacity={0.45}
      />
      <motion.line
        x1="18" y1="152" x2="282" y2="152"
        {...stroke}
        style={{ transformOrigin: '18px 152px' }}
        animate={{ scaleX: [0.28, 0.85, 0.28] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

/** @deprecated kept name for call sites during rewrite */
function PosterScene({ kind }: { kind: VectorKind; featured?: boolean }) {
  return (
    <div className="absolute inset-[6%] drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]">
      <VectorArt kind={kind} />
    </div>
  );
}

/**
 * Lienzo en blanco — portal de papel independiente de la colección de plantillas.
 */
export function BlankCanvasLaunch({
  title,
  onTitleChange,
  formatId,
  onFormatChange,
  onOpen,
  opening,
}: {
  title: string;
  onTitleChange: (v: string) => void;
  formatId: BlankFormatId;
  onFormatChange: (id: BlankFormatId) => void;
  onOpen: () => void;
  opening?: boolean;
}) {
  const format = BLANK_FORMATS.find((f) => f.id === formatId) ?? BLANK_FORMATS[0];
  const isLandscape = format.orientation === 'landscape';
  const canOpen = Boolean(title.trim()) && !opening;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Lienzo en blanco"
      className="relative"
    >
      <div className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-neon/20 via-violet/10 to-rosa/15 blur-xl sm:-inset-4" />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/20 bg-[#E8ECF1] text-ink shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(circle_at_1px_1px,rgba(5,6,8,0.06)_1px,transparent_0)] [background-size:18px_18px]" />
        <motion.div
          className="pointer-events-none absolute -right-16 top-[-20%] h-[70%] w-[45%] rounded-full bg-neon/25 blur-3xl"
          animate={{ opacity: [0.35, 0.65, 0.35], x: [0, -12, 0] }}
          transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          className="pointer-events-none absolute -left-10 bottom-[-30%] h-[55%] w-[40%] rounded-full bg-rosa/20 blur-3xl"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
        />

        <div className="relative grid gap-5 p-4 sm:gap-8 sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-stretch lg:gap-10 lg:p-9">
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-neon">
                Lienzo libre
              </span>
              <span className="hidden h-3 w-px bg-ink/15 sm:block" aria-hidden />
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/45">
                Independiente de plantillas
              </span>
            </div>

            <label className="mt-5 block">
              <span className="sr-only">Nombre de la pieza</span>
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canOpen) {
                    e.preventDefault();
                    onOpen();
                  }
                }}
                placeholder="Nombre de la pieza…"
                className="w-full border-0 border-b border-ink/15 bg-transparent pb-2 font-display text-2xl font-extrabold tracking-[-0.045em] text-ink outline-none transition placeholder:text-ink/30 focus:border-neon sm:text-4xl lg:text-[2.65rem]"
              />
            </label>

            <p className="mt-3 max-w-md font-serif text-base leading-relaxed text-ink/60 sm:text-lg">
              Página vacía. Tipografía, formas y bloques los decides tú en el estudio.
            </p>

            <div className="mt-6">
              <p className="mb-2.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink/45">
                Formato
              </p>
              <div className="flex flex-wrap gap-2">
                {BLANK_FORMATS.map((f) => {
                  const active = f.id === formatId;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onFormatChange(f.id)}
                      className={
                        active
                          ? 'rounded-lg bg-ink px-3 py-2 text-left transition'
                          : 'rounded-lg border border-ink/12 bg-white/60 px-3 py-2 text-left transition hover:border-ink/25 hover:bg-white'
                      }
                    >
                      <span className={active ? 'block text-sm font-semibold text-paper' : 'block text-sm font-semibold text-ink'}>
                        {f.label}
                      </span>
                      <span
                        className={
                          active
                            ? 'mt-0.5 block font-mono text-[0.65rem] tabular-nums text-paper/55'
                            : 'mt-0.5 block font-mono text-[0.65rem] tabular-nums text-ink/45'
                        }
                      >
                        {f.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
              <button
                type="button"
                disabled={!canOpen}
                onClick={onOpen}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-neon disabled:cursor-not-allowed disabled:opacity-40"
              >
                {opening ? 'Abriendo…' : 'Entrar al estudio'}
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/40">
                o clic en el papel · ↵
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={!canOpen}
            onClick={onOpen}
            title="Abrir lienzo en blanco"
            className="group relative mx-auto flex w-full max-w-sm items-center justify-center self-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60 disabled:cursor-not-allowed lg:max-w-none"
          >
            <div
              className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_18px_50px_rgba(5,6,8,0.12)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_60px_rgba(79,128,255,0.22)] group-disabled:opacity-60 ${
                isLandscape ? 'aspect-[16/10] w-full' : 'aspect-[4/5] w-[78%] sm:w-[70%]'
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(79,128,255,0.04),transparent_40%)]" />
              <div className="pointer-events-none absolute inset-4 rounded-lg border border-dashed border-ink/12 sm:inset-5" />
              <motion.div
                className="relative grid h-14 w-14 place-items-center rounded-full bg-ink text-paper shadow-lg transition group-hover:bg-neon"
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                <Plus size={26} strokeWidth={2.25} />
              </motion.div>
              <span className="absolute bottom-3 left-3 right-3 truncate text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink/35 sm:bottom-4">
                {format.short}
              </span>
            </div>
          </button>
        </div>
      </div>
    </motion.section>
  );
}

/** @deprecated use BlankCanvasLaunch */
export function BlankTemplateCard({
  onOpen,
  opening,
}: {
  selected?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
  opening?: boolean;
}) {
  return (
    <BlankCanvasLaunch
      title="En blanco"
      onTitleChange={() => {}}
      formatId="story"
      onFormatChange={() => {}}
      onOpen={() => onOpen?.()}
      opening={opening}
    />
  );
}

/** Poster cinético — la plantilla ES la pieza visual. */
export function TemplateCard({
  template,
  onOpen,
  opening,
  size = 'standard',
  delay = 0,
}: {
  template: TemplateInfo;
  selected?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
  opening?: boolean;
  featured?: boolean;
  size?: 'hero' | 'tall' | 'wide' | 'standard';
  delay?: number;
}) {
  const visual = POSTERS[template.id] ?? FALLBACK;

  /* Mobile: full-bleed hero/wide read taller; half-cells stay compact. Desktop unchanged. */
  const sizeClass =
    size === 'hero'
      ? 'min-h-[17.5rem] sm:min-h-[34rem]'
      : size === 'tall'
        ? 'min-h-[14.5rem] sm:min-h-[36rem]'
        : size === 'wide'
          ? 'min-h-[16.5rem] sm:min-h-[30rem]'
          : 'min-h-[14.5rem] sm:min-h-[30rem]';

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={opening ? `Abriendo ${template.name}` : `Abrir plantilla ${template.name}`}
      aria-busy={opening || undefined}
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen?.()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.();
        }
      }}
      title="Clic para abrir en el editor"
      className={`group relative flex h-full ${sizeClass} @container cursor-pointer flex-col overflow-hidden rounded-[1.35rem] text-left outline-none transition duration-400 focus-visible:ring-2 focus-visible:ring-neon/55`}
      style={{
        boxShadow: `0 0 0 1px rgba(255,255,255,0.14), 0 28px 70px ${visual.glow}`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <KineticField accent={visual.accent} soft={visual.soft} />
        {/* Slightly higher than before so white strokes clear the title */}
        <div className="absolute inset-x-0 top-[4%] bottom-[44%] overflow-hidden">
          <PosterScene kind={visual.vector} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      </div>

      <span className="pointer-events-none absolute -right-1 -top-2 select-none font-display text-[3.75rem] font-extrabold leading-none tracking-tighter text-white/[0.14] sm:text-[7.5rem]">
        {visual.index}
      </span>

      <div className="relative z-10 flex items-start justify-between gap-2 p-3 sm:gap-3 sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="rounded-full bg-black/40 px-2 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/35 backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.16em]">
            {visual.index}
          </span>
          <span className="hidden rounded-full bg-white/18 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white ring-1 ring-white/25 backdrop-blur-md sm:inline">
            {visual.pages}
          </span>
        </div>
        <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/75 sm:inline">
          {visual.motif}
        </span>
      </div>

      <div className="relative z-10 mt-auto min-w-0 px-3 pb-3 pt-2 sm:px-5 sm:pb-5 sm:pt-4">
        <p className="mb-1 hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/65 sm:mb-1.5 sm:block">
          {visual.tagline}
        </p>
        {/* Fit-to-card title: never clip on narrow 2-col phones */}
        <h4 className="w-full font-display text-[0.72rem] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] sm:text-[clamp(0.9rem,7.2cqi,1.75rem)] sm:leading-[0.95] sm:tracking-[-0.035em]">
          {visual.category === 'Presentación' ? (
            <>
              <span className="sm:hidden">Slide</span>
              <span className="hidden sm:inline">{visual.category}</span>
            </>
          ) : (
            visual.category
          )}
        </h4>
        <p className="mt-1.5 line-clamp-2 break-words font-serif text-[0.78rem] leading-snug text-white/90 sm:mt-2.5 sm:text-base">
          {template.name}
        </p>
        <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/65 sm:mt-1 sm:text-sm">
          {template.width}×{template.height}
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/25 pt-2 sm:mt-4 sm:gap-3 sm:pt-3">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/75 transition group-hover:text-white sm:text-[0.7rem] sm:tracking-[0.16em]">
            {opening ? 'Abriendo…' : 'Abrir'}
          </span>
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition duration-300 group-hover:scale-110 group-hover:brightness-110 sm:h-9 sm:w-9"
            style={{ background: visual.accent, color: '#050608' }}
          >
            <ArrowUpRight size={15} strokeWidth={2.4} className="sm:hidden" />
            <ArrowUpRight size={17} strokeWidth={2.4} className="hidden sm:block" />
          </span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-[1.35rem] opacity-0 transition duration-400 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.5), 0 0 60px ${visual.glow}`,
        }}
      />
    </motion.div>
  );
}

/** Galería bento 3+3 — tamaños distintos, ritmo editorial. */
export function TemplateGallery({
  templates,
  openingId,
  onOpen,
}: {
  templates: TemplateInfo[];
  openingId: string | null;
  onOpen: (template: TemplateInfo) => void;
}) {
  const rowA = templates.slice(0, 3);
  const rowB = templates.slice(3, 6);
  const marquee = ['Manifiesto', 'Portfolio', 'Portada', 'Revista', 'Lookbook', 'Slide', 'PLIEGO'];

  // Mobile: magazine rhythm (full → pair / pair → full) so no orphan cell.
  // Desktop (lg+): unchanged 12-col bento.
  const spanA = [
    'col-span-2 lg:col-span-6',
    'col-span-1 lg:col-span-3',
    'col-span-1 lg:col-span-3',
  ] as const;
  const sizeA = ['hero', 'tall', 'tall'] as const;
  const spanB = [
    'col-span-1 lg:col-span-3',
    'col-span-1 lg:col-span-3',
    'col-span-2 lg:col-span-6',
  ] as const;
  const sizeB = ['tall', 'standard', 'wide'] as const;

  return (
    <section id="coleccion-plantillas-inner" aria-label="Colección de plantillas">
      <div className="relative mb-8 overflow-hidden rounded-[1.35rem] border border-white/10 bg-ink-2/60 px-5 py-6 sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-rosa/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-36 w-36 rounded-full bg-neon/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rosa/60 to-transparent" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-rosa">Colección PLIEGO</p>
            <h3 className="mt-2 max-w-xl font-display text-[1.75rem] font-extrabold tracking-[-0.045em] text-paper sm:text-5xl">
              Seis estructuras
              <span
                className="block text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${BRAND.neon}, ${BRAND.rosa}, ${BRAND.lima})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                con impacto
              </span>
            </h3>
            <p
              className="mt-3 max-w-sm text-paper/75 sm:max-w-md"
              style={{
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                lineHeight: 1.45,
                letterSpacing: '0',
                wordSpacing: 'normal',
              }}
            >
              Plantillas listas para abrir, con tamaño y color propios.
            </p>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-6xl font-extrabold tracking-[-0.06em] text-paper/15 sm:text-7xl">
              06
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-paper/45">
              formatos
              <br />
              editoriales
            </span>
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden border-t border-white/10 pt-3">
          <motion.div
            className="flex w-max gap-6 font-mono text-[0.65rem] uppercase tracking-[0.06em] text-paper/40"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            {[...marquee, ...marquee, ...marquee].map((label, i) => (
              <span key={`${label}-${i}`} className="flex items-center gap-6 whitespace-nowrap">
                {label}
                <span className="text-rosa/70">◆</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-paper/40">
          Serie A · 01–03
        </p>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-paper/30">
          Piezas largas
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-12">
        {rowA.map((t, i) => (
          <div key={t.id} className={spanA[i]}>
            <TemplateCard
              template={t}
              size={sizeA[i]}
              delay={0.05 + i * 0.06}
              opening={openingId === t.id}
              onOpen={() => onOpen(t)}
            />
          </div>
        ))}
      </div>

      <div className="my-8 flex items-center gap-4" aria-hidden>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rosa/40 to-transparent" />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-paper/35">
          pliego
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-paper/40">
          Serie B · 04–06
        </p>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-paper/30">
          Spreads & stage
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-12">
        {rowB.map((t, i) => (
          <div key={t.id} className={spanB[i]}>
            <TemplateCard
              template={t}
              size={sizeB[i]}
              delay={0.08 + i * 0.06}
              opening={openingId === t.id}
              onOpen={() => onOpen(t)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

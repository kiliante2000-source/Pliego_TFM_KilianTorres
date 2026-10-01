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
    tagline: 'Hero · case · cierre',
    pages: '3 págs',
    motif: 'STACK',
  },
  'portada-editorial': {
    category: 'Portada',
    index: '03',
    accent: '#A855F7',
    soft: '#C9A0FF',
    glow: glow('#A855F7'),
    vector: 'cover',
    tagline: 'Cover · cuerpo · CTA',
    pages: '3 págs',
    motif: 'ORBIT',
  },
  'revista-doble': {
    category: 'Revista',
    index: '04',
    accent: '#B2FF3A',
    soft: '#D4FF80',
    glow: glow('#B2FF3A', 0.38),
    vector: 'magazine',
    tagline: 'Portada · ensayo · cierre',
    pages: '3 págs',
    motif: 'COLUMNS',
  },
  'catalogo-producto': {
    category: 'Lookbook',
    index: '05',
    accent: '#FF7A45',
    soft: '#FFB07A',
    glow: glow('#FF7A45'),
    vector: 'catalog',
    tagline: 'Hero · edit · shop',
    pages: '3 págs',
    motif: 'DUAL',
  },
  'presentacion-slide': {
    category: 'Presentación',
    index: '06',
    accent: '#22D3EE',
    soft: '#67E8F9',
    glow: glow('#22D3EE'),
    vector: 'slide',
    tagline: 'Apertura · argumento · cierre',
    pages: '3 págs',
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

/** Static poster atmosphere — blurs stay inside a clipped host (no square remates). */
function KineticField({ accent, soft }: { accent: string; soft: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
      <div className="absolute inset-0" style={{ background: accent }} />
      <div
        className="absolute inset-[-20%]"
        style={{
          background: `conic-gradient(from 210deg at 42% 38%, ${accent}, ${soft}, rgba(255,255,255,0.45), ${accent})`,
        }}
      />
      <div
        className="absolute -right-[20%] top-[-28%] h-[90%] w-[70%] rounded-full opacity-45 blur-2xl"
        style={{ background: soft }}
      />
      <div
        className="absolute -bottom-[28%] -left-[22%] h-[75%] w-[65%] rounded-full opacity-30 blur-2xl"
        style={{ background: '#fff' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgba(255,255,255,0.38),transparent_52%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
    </div>
  );
}

/** Stroke scales with the SVG (no non-scaling-stroke — that looked like chalk stubs on mobile). */
const stroke = {
  fill: 'none' as const,
  stroke: '#FFFFFF',
  strokeWidth: 7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
const strokeSoft = { ...stroke, strokeOpacity: 0.55, strokeWidth: 5.5 };
const svgClass = 'h-full w-full max-h-full max-w-full overflow-visible';

/** Diagramas vectoriales PLIEGO — estructura clara a cualquier escala. */
function VectorArt({ kind }: { kind: VectorKind }) {
  if (kind === 'manifesto') {
    return (
      <svg viewBox="0 0 280 200" preserveAspectRatio="xMidYMid meet" className={svgClass} aria-hidden>
        <line x1="32" y1="28" x2="32" y2="172" {...stroke} />
        <line x1="52" y1="44" x2="176" y2="44" {...stroke} />
        <line x1="52" y1="72" x2="152" y2="72" {...stroke} />
        <line x1="52" y1="100" x2="128" y2="100" {...stroke} />
        <line x1="52" y1="28" x2="228" y2="168" {...strokeSoft} />
        <circle cx="226" cy="58" r="30" {...stroke} />
        <circle cx="226" cy="58" r="7" fill="#fff" />
        <rect x="52" y="148" width="64" height="22" rx="11" {...stroke} />
      </svg>
    );
  }

  if (kind === 'portfolio') {
    return (
      <svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid meet" className={svgClass} aria-hidden>
        <rect x="36" y="20" width="128" height="220" rx="10" {...stroke} />
        <rect x="54" y="42" width="92" height="78" rx="5" {...stroke} />
        <line x1="54" y1="144" x2="146" y2="144" {...stroke} />
        <line x1="54" y1="164" x2="128" y2="164" {...stroke} />
        <line x1="54" y1="184" x2="114" y2="184" {...strokeSoft} />
        <rect x="54" y="208" width="92" height="12" rx="6" {...stroke} />
      </svg>
    );
  }

  if (kind === 'cover') {
    return (
      <svg viewBox="0 0 260 220" preserveAspectRatio="xMidYMid meet" className={svgClass} aria-hidden>
        <rect x="28" y="24" width="150" height="172" rx="8" {...stroke} />
        <line x1="52" y1="24" x2="52" y2="196" {...stroke} />
        <circle cx="198" cy="82" r="44" {...stroke} />
        <circle cx="198" cy="82" r="16" {...strokeSoft} />
        <line x1="64" y1="148" x2="148" y2="148" {...stroke} />
        <line x1="64" y1="168" x2="118" y2="168" {...strokeSoft} />
      </svg>
    );
  }

  if (kind === 'magazine') {
    return (
      <svg viewBox="0 0 280 200" preserveAspectRatio="xMidYMid meet" className={svgClass} aria-hidden>
        <rect x="20" y="20" width="240" height="160" rx="8" {...stroke} />
        <line x1="112" y1="20" x2="112" y2="180" {...stroke} />
        <rect x="36" y="36" width="60" height="14" rx="3" {...stroke} />
        <rect x="36" y="62" width="60" height="56" rx="4" {...stroke} />
        <line x1="36" y1="136" x2="96" y2="136" {...stroke} />
        <line x1="36" y1="154" x2="82" y2="154" {...strokeSoft} />
        <rect x="130" y="36" width="112" height="16" rx="3" {...stroke} />
        <line x1="130" y1="72" x2="242" y2="72" {...stroke} />
        <line x1="130" y1="92" x2="242" y2="92" {...stroke} />
        <line x1="130" y1="112" x2="214" y2="112" {...strokeSoft} />
        <rect x="130" y="132" width="112" height="32" rx="4" {...stroke} />
      </svg>
    );
  }

  if (kind === 'catalog') {
    return (
      <svg viewBox="0 0 280 200" preserveAspectRatio="xMidYMid meet" className={svgClass} aria-hidden>
        <rect x="28" y="24" width="100" height="152" rx="8" {...stroke} />
        <rect x="42" y="40" width="72" height="70" rx="4" {...stroke} />
        <line x1="42" y1="128" x2="114" y2="128" {...stroke} />
        <line x1="42" y1="148" x2="96" y2="148" {...strokeSoft} />
        <rect x="152" y="24" width="100" height="152" rx="8" {...stroke} />
        <rect x="166" y="40" width="72" height="70" rx="4" {...stroke} />
        <line x1="166" y1="128" x2="238" y2="128" {...stroke} />
        <line x1="166" y1="148" x2="220" y2="148" {...strokeSoft} />
      </svg>
    );
  }

  // slide
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" className={svgClass} aria-hidden>
      <rect x="20" y="28" width="260" height="124" rx="10" {...stroke} />
      <line x1="44" y1="58" x2="168" y2="58" {...stroke} />
      <line x1="44" y1="80" x2="148" y2="80" {...stroke} />
      <line x1="44" y1="102" x2="128" y2="102" {...strokeSoft} />
      <circle cx="232" cy="90" r="28" {...stroke} />
      <path d="M222 76 L248 90 L222 104 Z" fill="#fff" stroke="none" />
      <line x1="20" y1="162" x2="280" y2="162" {...strokeSoft} />
    </svg>
  );
}

/** Vector plate — stroke scales with size; light padding so art fills the color band. */
function PosterScene({ kind }: { kind: VectorKind; featured?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full p-[4%] drop-shadow-[0_0_18px_rgba(255,255,255,0.3)] sm:p-[6%]">
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
        <div className="pointer-events-none absolute -right-16 top-[-20%] h-[70%] w-[45%] rounded-full bg-neon/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-[-30%] h-[55%] w-[40%] rounded-full bg-rosa/20 blur-3xl" />

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
  const featured = size === 'hero' || size === 'wide';

  /* Mobile: full-bleed hero/wide read taller; half-cells stay compact. Desktop unchanged. */
  const sizeClass =
    size === 'hero'
      ? 'min-h-[17.5rem] sm:min-h-[34rem]'
      : size === 'tall'
        ? 'min-h-[15rem] sm:min-h-[36rem]'
        : size === 'wide'
          ? 'min-h-[16.5rem] sm:min-h-[30rem]'
          : 'min-h-[15rem] sm:min-h-[30rem]';

  return (
    // Outer shell: NO transform — Safari clips border-radius reliably only without motion transforms.
    <div
      className={`h-full ${sizeClass}`}
      style={{
        borderRadius: '1.35rem',
        overflow: 'hidden',
        // Force Safari to mask blurred/overflow children to the rounded rect
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        maskImage: 'radial-gradient(white, black)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.14), 0 22px 48px ${visual.glow}`,
      }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={opening ? `Abriendo ${template.name}` : `Abrir plantilla ${template.name}`}
        aria-busy={opening || undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: Math.min(delay, 0.2), duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => onOpen?.()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen?.();
          }
        }}
        title="Clic para abrir en el editor"
        className="group relative flex h-full cursor-pointer flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neon/55"
        style={{ borderRadius: 'inherit' }}
      >
        <div className="absolute inset-0" style={{ borderRadius: 'inherit', overflow: 'hidden' }}>
          <KineticField accent={visual.accent} soft={visual.soft} />
          {/* Soft fade only near the title band — keep the color field vivid behind the vector */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent sm:via-black/25 sm:to-black/5" />
        </div>

        <span className="pointer-events-none absolute -right-1 top-0 select-none font-display text-[2.75rem] font-extrabold leading-none tracking-tighter text-white/[0.12] sm:-top-2 sm:text-[7.5rem]">
          {visual.index}
        </span>

        {/* Color band: grows and truly centers the vector on mobile */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2 p-3 sm:gap-3 sm:p-5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="rounded-full bg-black/45 px-2 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/35 backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.16em]">
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

          {/* Mobile: larger art, centered in the remaining color area */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-1 sm:hidden">
            <div
              className={
                featured
                  ? 'pointer-events-none h-[min(10.5rem,42vw)] w-[min(10.5rem,42vw)]'
                  : 'pointer-events-none h-[min(8.25rem,38vw)] w-[min(8.25rem,38vw)]'
              }
            >
              <PosterScene kind={visual.vector} />
            </div>
          </div>

          {/* Desktop: absolute mid-field vector */}
          <div
            className={
              featured
                ? 'pointer-events-none absolute left-1/2 top-[34%] hidden w-[min(68%,26rem)] -translate-x-1/2 -translate-y-1/2 sm:block'
                : 'pointer-events-none absolute left-1/2 top-[32%] hidden w-[min(72%,20rem)] -translate-x-1/2 -translate-y-1/2 sm:block'
            }
          >
            <PosterScene kind={visual.vector} />
          </div>
        </div>

        {/* Title block — solid scrim on mobile so type stays clear under larger art */}
        <div className="relative z-20 mt-auto min-w-0 shrink-0 bg-black/60 px-3 pb-3 pt-2.5 backdrop-blur-[2px] sm:bg-gradient-to-t sm:from-black/80 sm:via-black/45 sm:to-transparent sm:px-5 sm:pb-5 sm:pt-10 sm:backdrop-blur-0">
          <p className="mb-1 hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/65 sm:mb-1.5 sm:block">
            {visual.tagline}
          </p>
          <h4 className="w-full font-display text-[0.82rem] font-extrabold uppercase leading-[1.08] tracking-[-0.03em] text-white sm:text-[clamp(0.9rem,7.2cqi,1.75rem)] sm:leading-[0.95] sm:tracking-[-0.035em]">
            {visual.category === 'Presentación' ? (
              <>
                <span className="sm:hidden">Slide</span>
                <span className="hidden sm:inline">{visual.category}</span>
              </>
            ) : (
              visual.category
            )}
          </h4>
          <p className="mt-1 line-clamp-2 break-words font-serif text-[0.76rem] leading-snug text-white/92 sm:mt-2.5 sm:text-base">
            {template.name}
          </p>
          <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/70 sm:mt-1 sm:text-sm">
            {template.width}×{template.height}
          </p>

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/25 pt-2 sm:mt-4 sm:gap-3 sm:pt-3">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/80 transition group-hover:text-white sm:text-[0.7rem] sm:tracking-[0.16em]">
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
      </motion.div>
    </div>
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
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.65rem] uppercase tracking-[0.06em] text-paper/40">
            {marquee.map((label) => (
              <span key={label} className="flex items-center gap-2 whitespace-nowrap">
                {label}
                <span className="text-rosa/70">◆</span>
              </span>
            ))}
          </div>
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
          <div key={t.id} className={`${spanA[i]} overflow-hidden rounded-[1.35rem]`}>
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
          <div key={t.id} className={`${spanB[i]} overflow-hidden rounded-[1.35rem]`}>
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

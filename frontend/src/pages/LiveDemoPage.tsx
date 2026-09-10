import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { Logo, ButtonLink } from '../components/ui/primitives';
import { Magnetic, Marquee } from '../components/creative/Motion';

const ease = [0.16, 1, 0.3, 1] as const;
const VERBS = ['DISEÑA', 'COMPÓN', 'ANIMA', 'PUBLICA'] as const;

const ACTIONS = [
  { n: '01', label: 'Acceder', color: '#4F80FF', verb: 'Entra al estudio' },
  { n: '02', label: 'Crear', color: '#FF4EDB', verb: 'Nueva pieza' },
  { n: '03', label: 'Diseñar', color: '#A855F7', verb: 'Capas · type · vector' },
  { n: '04', label: 'Guardar', color: '#B2FF3A', verb: 'Sin perder el pulso' },
  { n: '05', label: 'Versionar', color: '#FF7A45', verb: 'Historiza el cambio' },
  { n: '06', label: 'Exportar', color: '#4F80FF', verb: 'PDF · PNG · link' },
  { n: '07', label: 'Publicar', color: '#FF4EDB', verb: 'Al mundo, en vivo' },
] as const;

const PRODUCTS = [
  {
    kind: 'Portada',
    title: 'VOL. 07',
    subtitle: 'Revista cultural',
    tone: 'from-[#4F80FF] via-[#A855F7] to-[#FF4EDB]',
    body: 'Tipografía display, orbe de marca y marco editorial.',
  },
  {
    kind: 'Lookbook',
    title: 'SS26',
    subtitle: 'Catálogo moda',
    tone: 'from-[#FF4EDB] via-[#FF7A45] to-[#B2FF3A]',
    body: 'Páginas duales, foto + caption, ritmo de desfile.',
  },
  {
    kind: 'Deck',
    title: 'PITCH',
    subtitle: 'Presentación',
    tone: 'from-[#B2FF3A] via-[#4F80FF] to-[#A855F7]',
    body: 'Slides widescreen con motion al scroll.',
  },
  {
    kind: 'Poster',
    title: 'NOCHE',
    subtitle: 'Cartel de evento',
    tone: 'from-[#A855F7] via-[#FF4EDB] to-[#4F80FF]',
    body: 'Impacto tipográfico a una sola vista.',
  },
  {
    kind: 'Spread',
    title: 'ENSAYO',
    subtitle: 'Doble página',
    tone: 'from-[#FF7A45] via-[#A855F7] to-[#4F80FF]',
    body: 'Columnas, pull-quote y acento lima.',
  },
  {
    kind: 'Cover',
    title: 'PLIEGO',
    subtitle: 'Identidad viva',
    tone: 'from-[#4F80FF] via-[#FF4EDB] to-[#B2FF3A]',
    body: 'La marca como sistema, no como logo estático.',
  },
] as const;

function useCycle(length: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms]);
  return i;
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.22 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function LivingArtboard() {
  const verb = useCycle(VERBS.length, 2200);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <div className="absolute -inset-10 rounded-[2rem] bg-gradient-to-br from-neon/35 via-rosa/20 to-lima/15 blur-3xl" />
      <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-[#0b0e11] shadow-[0_40px_120px_rgba(0,0,0,0.55)] [isolation:isolate]">
        <motion.div
          className="absolute inset-y-0 left-0 z-[3] w-[11px]"
          style={{ backgroundImage: 'var(--brand-flow)', backgroundSize: '400% 100%' }}
          animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 z-[3] h-[11px]"
          style={{ backgroundImage: 'var(--brand-flow)', backgroundSize: '400% 100%' }}
          animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          className="pliego-orb-live absolute -right-[20%] top-[8%] z-[1] aspect-square w-[80%] rounded-full"
          animate={{ y: [0, -18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute right-10 top-16 z-[2] h-28 w-40 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
          animate={{ y: [0, 10, 0], rotate: [6, 3, 6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-16 top-24 z-[2] h-24 w-36 rounded-lg border border-rosa/40 bg-rosa/10"
          animate={{ y: [0, -8, 0], rotate: [-4, -1, -4] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute left-7 top-6 z-[4] rounded-[4px] border border-white/25 bg-[#121826]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          01 / 07
        </motion.div>

        <div className="absolute left-7 top-[32%] z-[4] max-w-[84%]">
          <div className="relative min-h-[3.2rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={VERBS[verb]}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="inline-block bg-[#152238] px-3 py-1.5"
              >
                <span className="font-display text-[clamp(2.2rem,7vw,3.2rem)] font-bold leading-none tracking-[-0.06em]">
                  {VERBS[verb]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 inline-block bg-[#152238] px-2.5 py-1">
            <span className="text-[15px] font-medium">con PLIEGO</span>
          </div>
          <div className="mt-2 inline-block bg-[#152238] px-2.5 py-1">
            <span className="text-[15px] font-medium">en el browser.</span>
          </div>
        </div>

        <motion.div
          className="absolute bottom-[24%] left-8 z-[4] rounded-md border border-neon/70 bg-ink/55 px-2.5 py-1.5 backdrop-blur-md"
          animate={{ y: [0, -12, 0], rotate: [-2, 1.5, -2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="absolute -left-1 -top-1 h-2 w-2 bg-neon" />
          <span className="absolute -right-1 -top-1 h-2 w-2 bg-neon" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-neon" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-neon" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
            layer · type
          </span>
        </motion.div>

        <motion.div
          className="absolute bottom-[30%] right-7 z-[4] flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md"
          animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="h-2 w-2 rounded-full bg-rosa" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/75">vector</span>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute z-[5]"
          animate={{ x: [52, 230, 160, 52], y: [130, 185, 270, 130] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <path d="M1 1l15 8.2-6.6 1.6L7.2 21 1 1z" fill="#F4F6F8" stroke="#0B0E11" />
          </svg>
          <div className="ml-3 mt-1 whitespace-nowrap rounded bg-paper px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-ink">
            edit
          </div>
        </motion.div>

        <div className="absolute bottom-6 right-5 z-[4] inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-lima"
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
          demo viva
        </div>
      </div>
    </div>
  );
}

function ActionRail() {
  const active = useCycle(ACTIONS.length, 1700);
  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neon">Flujo PLIEGO</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Siete gestos. Una pieza.
          </h2>
        </div>
        <p className="max-w-xs text-sm text-paper/55 md:text-right">
          Cada color es una acción real del producto — de abrir el estudio a publicar en vivo.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/10 lg:block" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {ACTIONS.map((a, i) => {
            const on = i === active;
            return (
              <motion.div
                key={a.n}
                animate={{ y: on ? -8 : 0, scale: on ? 1.04 : 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="relative rounded-2xl border border-white/8 bg-ink-2/70 p-4"
                style={{
                  boxShadow: on ? `0 20px 50px ${a.color}33` : undefined,
                  borderColor: on ? `${a.color}66` : undefined,
                }}
              >
                <motion.div
                  className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full font-mono text-xs font-bold text-ink"
                  style={{ background: a.color }}
                  animate={on ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 0.9, repeat: on ? Infinity : 0 }}
                >
                  {a.n}
                </motion.div>
                <p className="text-center font-display text-lg font-bold tracking-tight">{a.label}</p>
                <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
                  {a.verb}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  return (
    <Reveal delay={index * 0.06}>
      <motion.article
        whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#0c1016]"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${product.tone} opacity-80`} />
        <motion.div
          className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl"
          animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
          transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute left-4 top-4 z-10 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/35" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <p className="absolute right-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
          {product.kind}
        </p>
        <div className="absolute inset-x-5 bottom-5 z-10">
          <p className="font-display text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
            {product.title}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/75">
            {product.subtitle}
          </p>
          <p className="mt-3 max-w-[16rem] text-sm text-white/80 opacity-0 transition duration-300 group-hover:opacity-100">
            {product.body}
          </p>
        </div>
        <motion.div
          className="absolute left-5 top-1/2 h-px w-16 origin-left bg-white/50"
          animate={{ scaleX: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.2 }}
        />
      </motion.article>
    </Reveal>
  );
}

function CanvasSimulation() {
  const step = useCycle(4, 2000);
  const labels = ['Añadir texto', 'Crear forma', 'Aplicar motion', 'Publicar link'] as const;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-rosa">Canvas en acción</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Lo que haces en el editor se ve en la pieza.
        </h2>
        <ul className="mt-8 space-y-3">
          {labels.map((label, i) => (
            <motion.li
              key={label}
              animate={{
                backgroundColor: step === i ? 'rgba(79,128,255,0.16)' : 'rgba(255,255,255,0.03)',
                borderColor: step === i ? 'rgba(79,128,255,0.55)' : 'rgba(255,255,255,0.08)',
                x: step === i ? 8 : 0,
              }}
              className="flex items-center gap-3 rounded-xl border px-4 py-3"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                style={{
                  background: step === i ? '#4F80FF' : '#1e2630',
                  color: step === i ? '#0b0e11' : '#8b95a3',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-medium">{label}</span>
              {step === i ? (
                <motion.span
                  layoutId="canvas-play"
                  className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-lima"
                >
                  <Play size={10} /> live
                </motion.span>
              ) : null}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d12]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(244,246,248,0.16) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="t"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="absolute left-10 top-16"
            >
              <div className="relative border border-neon/80 bg-ink/40 px-3 py-2 backdrop-blur">
                <span className="absolute -left-1 -top-1 h-2 w-2 bg-neon" />
                <span className="absolute -right-1 -top-1 h-2 w-2 bg-neon" />
                <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-neon" />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-neon" />
                <p className="font-display text-4xl font-bold tracking-tight">Headline</p>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="s"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="absolute right-12 top-14 h-40 w-40 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #FF4EDB, #A855F7 45%, #4F80FF 75%, transparent)',
              }}
            />
          )}
          {step === 2 && (
            <motion.div
              key="m"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center"
            >
              <motion.p
                className="font-display text-5xl font-bold tracking-tight text-transparent"
                style={{
                  backgroundImage: 'var(--brand-flow)',
                  backgroundSize: '400% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%'], y: [0, -12, 0] }}
                transition={{
                  backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' },
                  y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                MOTION
              </motion.p>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="p"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center p-8"
            >
              <div className="w-full max-w-xs rounded-xl border border-lima/40 bg-ink/70 p-5 backdrop-blur">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lima">published</p>
                <p className="mt-2 font-display text-2xl font-bold">pliego.app/p/tu-pieza</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-lima"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 1.2, ease }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LiveDemoPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const heroVerb = useCycle(VERBS.length, 2400);

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-[#07090c] text-paper">
      <div className="pointer-events-none fixed inset-0 mesh-bg opacity-75" />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-neon via-rosa to-lima"
        style={{ scaleX: progress }}
      />

      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60 no-underline transition hover:bg-white/5 hover:text-paper"
          >
            <ArrowLeft size={14} /> Volver
          </Link>
          <Magnetic>
            <ButtonLink to="/register">
              Crear cuenta <ArrowRight size={16} />
            </ButtonLink>
          </Magnetic>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-7xl items-center gap-12 px-5 pb-24 pt-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-lima"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-lima"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            Demo viva · estudio editorial
          </motion.p>

          <div className="relative mt-6 min-h-[4.8rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={VERBS[heroVerb]}
                initial={{ y: 56, opacity: 0, rotate: -2 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -40, opacity: 0, rotate: 2 }}
                transition={{ duration: 0.55, ease }}
                className="font-display text-[clamp(3.6rem,13vw,7.2rem)] font-bold leading-[0.84] tracking-[-0.07em]"
              >
                {VERBS[heroVerb]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            className="mt-1 font-display text-[clamp(2.4rem,8vw,4.6rem)] font-bold leading-[0.9] tracking-[-0.06em] text-transparent"
            style={{
              backgroundImage: 'var(--brand-flow)',
              backgroundSize: '400% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
            animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            LO IMPOSIBLE
          </motion.p>
          <p
            className="mt-1 font-display text-[clamp(2rem,6.5vw,3.6rem)] font-bold leading-[0.92] tracking-[-0.05em] text-transparent"
            style={{ WebkitTextStroke: '1.5px rgba(244,246,248,0.42)' }}
          >
            EN UNA PÁGINA
          </p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65, ease }}
            className="mt-7 max-w-lg text-lg leading-snug text-paper/70"
          >
            Portadas, lookbooks, decks y carteles con el mismo motor: tipografía, vectores, motion y
            publicación. Esto no es un tour — es lo que puedes crear hoy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Magnetic strength={0.32}>
              <ButtonLink to="/register" className="px-6 py-3 text-base">
                Abrir el estudio <ArrowRight size={18} />
              </ButtonLink>
            </Magnetic>
            <a
              href="#productos"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55 no-underline transition hover:bg-white/5 hover:text-paper"
            >
              Ver piezas ↓
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease }}
        >
          <LivingArtboard />
        </motion.div>
      </section>

      <div className="relative z-10 border-y border-white/8 py-4">
        <Marquee
          items={[
            'Portadas',
            'Revistas',
            'Lookbooks',
            'Decks',
            'Carteles',
            'Identidad',
            'Motion',
            'Publicación',
          ]}
          speed={32}
        />
        <Marquee
          items={[
            'Capas',
            'Type',
            'Vectores',
            'Gradientes',
            'Versiones',
            'PDF',
            'Link vivo',
            'Plantillas',
          ]}
          speed={40}
          reverse
        />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-28 sm:px-8">
        <Reveal>
          <ActionRail />
        </Reveal>
      </section>

      <section id="productos" className="relative z-10 border-t border-white/8 py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-rosa">
              Productos creativos
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Seis salidas. Infinitas composiciones.
            </h2>
            <p className="mt-4 max-w-2xl text-paper/60">
              Cada tarjeta es un tipo de pieza que nace en PLIEGO: misma herramienta, lenguajes
              visuales distintos.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.kind} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-t border-white/8 py-28">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            className="pointer-events-none absolute -left-6 top-0 select-none font-display text-[8rem] font-bold leading-none tracking-[-0.08em] text-transparent sm:text-[11rem]"
            style={{ WebkitTextStroke: '1.5px rgba(244,246,248,0.1)' }}
            animate={{ x: [0, -50, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          >
            TYPE
          </motion.div>

          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-lima">Tipografía</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              El texto no ilustra.
              <br />
              <span
                className="text-transparent"
                style={{
                  backgroundImage: 'var(--brand-flow)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                El texto es la pieza.
              </span>
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-3">
            {[
              { t: 'DISPLAY', stroke: false, mono: false },
              { t: 'OUTLINE', stroke: true, mono: false },
              { t: 'mono / tracking', stroke: false, mono: true },
            ].map((row, i) => (
              <Reveal key={row.t} delay={i * 0.08}>
                <motion.div
                  className="overflow-hidden rounded-2xl border border-white/8 bg-ink-2/50 px-6 py-8"
                  whileHover={{ borderColor: 'rgba(79,128,255,0.45)' }}
                >
                  <motion.p
                    className={
                      row.mono
                        ? 'font-mono text-2xl font-bold uppercase tracking-[0.35em] text-paper'
                        : `font-display text-5xl font-bold tracking-[-0.06em] sm:text-7xl ${
                            row.stroke ? 'text-transparent' : ''
                          }`
                    }
                    style={
                      row.stroke
                        ? { WebkitTextStroke: '1.5px rgba(244,246,248,0.55)' }
                        : i === 0
                          ? {
                              backgroundImage: 'var(--brand-flow)',
                              backgroundSize: '400% 100%',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              color: 'transparent',
                            }
                          : undefined
                    }
                    animate={
                      i === 0
                        ? { backgroundPosition: ['0% 50%', '66.6667% 50%'] }
                        : { x: [0, 12, 0] }
                    }
                    transition={
                      i === 0
                        ? { duration: 14, repeat: Infinity, ease: 'linear' }
                        : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
                    }
                  >
                    {row.t}
                  </motion.p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/8 py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <CanvasSimulation />
          </Reveal>
        </div>
      </section>

      {/* Layers depth — editor metaphor */}
      <section className="relative z-10 overflow-hidden border-t border-white/8 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-violet">Capas</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Profundidad que se siente.
            </h2>
            <p className="mt-4 max-w-md text-paper/60">
              Fondo, forma, tipografía y UI se apilan con ritmo. En PLIEGO las capas no son un
              panel: son la composición.
            </p>
            <ul className="mt-8 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">
              {['04 · UI chrome', '03 · Tipografía', '02 · Orbe vector', '01 · Fondo mesh'].map(
                (l, i) => (
                  <motion.li
                    key={l}
                    className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2"
                    animate={{ x: [0, 6, 0], borderColor: ['rgba(255,255,255,0.08)', 'rgba(168,85,247,0.35)', 'rgba(255,255,255,0.08)'] }}
                    transition={{ duration: 3.2, delay: i * 0.35, repeat: Infinity }}
                  >
                    {l}
                  </motion.li>
                ),
              )}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {[
                { z: 1, rot: -8, scale: 0.92, bg: 'from-neon/40 to-violet/30', y: 18 },
                { z: 2, rot: 4, scale: 0.96, bg: 'from-rosa/45 to-neon/25', y: 8 },
                { z: 3, rot: -2, scale: 1, bg: 'from-[#152238] to-[#0b0e11]', y: 0 },
              ].map((layer, i) => (
                <motion.div
                  key={layer.z}
                  className={`absolute inset-[12%] rounded-2xl border border-white/15 bg-gradient-to-br ${layer.bg} shadow-2xl`}
                  style={{ zIndex: layer.z }}
                  animate={{
                    y: [layer.y, layer.y - 14, layer.y],
                    rotate: [layer.rot, layer.rot + 2, layer.rot],
                  }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {i === 2 ? (
                    <div className="flex h-full flex-col justify-between p-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
                        layer 03
                      </span>
                      <p className="font-display text-4xl font-bold tracking-tight">PLIEGO</p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lima">
                        · selected
                      </span>
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kinetic publish band */}
      <section className="relative z-10 overflow-hidden border-y border-white/8 bg-ink-2/40 py-10">
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-12 px-6">
              {['PUBLICA', 'COMPARTE', 'ITERA', 'EXPORTA', 'VERSIONA', 'SORPRENDE'].map((w) => (
                <span
                  key={`${copy}-${w}`}
                  className="font-display text-5xl font-bold tracking-[-0.06em] text-paper/20 sm:text-7xl"
                >
                  {w}
                  <span className="mx-4 text-rosa">/</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 border-t border-white/8 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { k: 'Capas', d: 'Ordena, mezcla y anima como en un estudio.' },
              { k: 'Marca', d: 'Neon, rosa, violet, lima y naranja en un solo sistema.' },
              { k: 'Publicación', d: 'De canvas a link vivo o PDF sin perder el diseño.' },
            ].map((item, i) => (
              <Reveal key={item.k} delay={i * 0.08}>
                <motion.div
                  className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6"
                  whileHover={{ y: -6 }}
                >
                  <p className="font-display text-2xl font-bold">{item.k}</p>
                  <p className="mt-2 text-sm text-paper/60">{item.d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/8 py-32">
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-rosa/20 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-naranja">Tu turno</p>
            <h2 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-7xl">
              Haz que se note.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-paper/65">
              Abre PLIEGO, elige una plantilla y publica una pieza con el mismo pulso que esta demo.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic strength={0.35}>
                <ButtonLink to="/register" className="min-w-52 px-6 py-3.5 text-base">
                  Crear cuenta <ArrowRight size={18} />
                </ButtonLink>
              </Magnetic>
              <ButtonLink to="/login" variant="soft" className="px-6 py-3.5">
                Entrar al estudio
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

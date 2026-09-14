import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo, ButtonLink } from '../components/ui/primitives';
import { Magnetic, Marquee } from '../components/creative/Motion';

const ease = [0.16, 1, 0.3, 1] as const;
const serif = { fontFamily: '"Instrument Serif", Georgia, serif' } as const;
const display = { fontFamily: '"Syne", "Space Grotesk", sans-serif' } as const;

const HOOKS = [
  'No es un panel.',
  'No es otra herramienta.',
  'Es una portada que late.',
] as const;

const CHAPTERS = [
  {
    id: '01',
    product: 'MANIFIESTO',
    short: 'Manifiesto digital',
    line: 'Un relato en tres actos.',
    detail: 'Portada, ensayo y cierre con motion: la pieza se siente campaña, no documento.',
    gradient: 'from-[#1a0a18] via-[#FF4EDB] to-[#A855F7]',
    accent: '#FF4EDB',
  },
  {
    id: '02',
    product: 'PORTFOLIO',
    short: 'Portfolio',
    line: 'Tu trabajo, con ritmo de portada.',
    detail: 'Hero tipográfico, case study y scroll que vende el proceso sin explicarlo de más.',
    gradient: 'from-[#0a1228] via-[#4F80FF] to-[#A855F7]',
    accent: '#4F80FF',
  },
  {
    id: '03',
    product: 'PORTADA',
    short: 'Portada',
    line: 'Una imagen que para el feed.',
    detail: 'Display brutal, orbe de marca y tipografía que manda en el primer golpe de vista.',
    gradient: 'from-[#1a1030] via-[#A855F7] to-[#FF4EDB]',
    accent: '#A855F7',
  },
  {
    id: '04',
    product: 'REVISTA',
    short: 'Páginas de revista',
    line: 'Maquetación que se lee como papel.',
    detail: 'Columnas, bloque visual y motion al scroll: página viva, no PDF plano.',
    gradient: 'from-[#0a1a10] via-[#B2FF3A] to-[#4F80FF]',
    accent: '#B2FF3A',
  },
  {
    id: '05',
    product: 'LOOKBOOK',
    short: 'Catálogo / lookbook',
    line: 'Producto con aire editorial.',
    detail: 'Doble spread, caption corto y CTA que vende sin parecer e-commerce genérico.',
    gradient: 'from-[#1a0a14] via-[#FF4EDB] to-[#FF7A45]',
    accent: '#FF7A45',
  },
  {
    id: '06',
    product: 'PRESENTACIÓN',
    short: 'Presentación',
    line: 'Una idea. Una diapositiva. Un golpe.',
    detail: 'Widescreen, entrada con motion y un cierre que pide acción.',
    gradient: 'from-[#121826] via-[#4F80FF] to-[#B2FF3A]',
    accent: '#4F80FF',
  },
] as const;

function useCycle(n: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => window.clearInterval(id);
  }, [n, ms]);
  return i;
}

/** Compact product gallery: one viewport, all formats switchable */
function ChapterGallery() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const chapter = CHAPTERS[active];

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % CHAPTERS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused, active]);

  const select = (i: number) => {
    setActive(i);
    setPaused(true);
    window.setTimeout(() => setPaused(false), 8000);
  };

  return (
    <section id="obra" className="relative z-10 overflow-hidden border-y border-white/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${chapter.gradient} opacity-95 transition-colors duration-700`} />
      <motion.div
        key={chapter.accent}
        className="absolute -right-[12%] top-[-10%] h-[55vmin] w-[55vmin] rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${chapter.accent} 0%, transparent 62%)`,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 0.7, ease }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">
              Formatos · Cap. {chapter.id}
            </p>
            <h2
              className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.045em] text-white"
              style={display}
            >
              Seis formatos. Un mismo golpe.
            </h2>
          </div>
        </div>

        {/* Format switcher */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CHAPTERS.map((ch, i) => {
            const on = i === active;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => select(i)}
                className="rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition sm:text-[11px] sm:tracking-[0.18em]"
                style={{
                  background: on ? ch.accent : 'rgba(0,0,0,0.35)',
                  color: on ? '#050608' : 'rgba(255,255,255,0.75)',
                  boxShadow: on ? `0 0 0 1px ${ch.accent}` : '0 0 0 1px rgba(255,255,255,0.15)',
                }}
              >
                {ch.short}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id + '-copy'}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/65">
                Cap. {chapter.id} · {chapter.product}
              </p>
              <h3
                className="mt-3 text-[clamp(2rem,5.5vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-white"
                style={display}
              >
                {chapter.line}
              </h3>
              <p className="mt-4 max-w-md text-lg text-white/75 sm:text-xl" style={serif}>
                {chapter.detail}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id + '-stage'}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease }}
              className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-sm bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.4)] ring-1 ring-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-white/5" />
              <motion.div
                className="absolute right-[-18%] top-[-12%] h-[75%] w-[75%] rounded-full opacity-90"
                style={{
                  background: `radial-gradient(circle, ${chapter.accent}, transparent 68%)`,
                }}
                animate={{ scale: [1, 1.06, 1], rotate: [0, 6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                PLIEGO · {chapter.id}
              </div>
              <div className="absolute inset-x-5 bottom-6">
                <p className="text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl" style={display}>
                  {chapter.product}
                </p>
                <p className="mt-1 text-lg italic text-white/80" style={serif}>
                  Hecho para detenerse.
                </p>
              </div>
              <div
                className="absolute bottom-0 left-0 h-1 w-full origin-left"
                style={{ background: chapter.accent }}
              >
                <motion.div
                  key={chapter.id + '-bar'}
                  className="h-full bg-white/40"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5.2, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini strip of all formats */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {CHAPTERS.map((ch, i) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => select(i)}
              className="group relative overflow-hidden rounded-sm text-left ring-1 ring-white/15 transition hover:ring-white/35"
              style={{
                background: `linear-gradient(135deg, ${ch.accent}33, rgba(0,0,0,0.55))`,
                outline: i === active ? `2px solid ${ch.accent}` : undefined,
                outlineOffset: 0,
              }}
            >
              <div className="px-3 py-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                  {ch.id}
                </p>
                <p className="mt-1 font-display text-sm font-extrabold tracking-tight text-white">
                  {ch.product}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}


function GestureFilm() {
  const step = useCycle(5, 1600);
  const frames = [
    { t: 'Abrir', d: 'El estudio aparece. Negro. Marca. Silencio.', accent: '#4F80FF' },
    { t: 'Componer', d: 'Type, orbe, marco. Tres gestos. Una portada.', accent: '#FF4EDB' },
    { t: 'Mover', d: 'La capa respira. El cursor deja rastro.', accent: '#A855F7' },
    { t: 'Versionar', d: 'El cambio queda. La pieza no se rompe.', accent: '#FF7A45' },
    { t: 'Publicar', d: 'Un link. El trabajo sale del canvas.', accent: '#B2FF3A' },
  ] as const;
  const accent = frames[step].accent;

  return (
    <section className="relative min-h-svh overflow-hidden bg-[#050608] py-28">
      {/* Atmospheric brand lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 18% 20%, rgba(255,78,219,0.22), transparent 55%), radial-gradient(ellipse 55% 50% at 82% 28%, rgba(79,128,255,0.2), transparent 55%), radial-gradient(ellipse 50% 45% at 55% 88%, rgba(168,85,247,0.16), transparent 50%)',
          }}
        />
        <motion.div
          className="absolute -left-[10%] top-[8%] h-[55vmin] w-[55vmin] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(255,78,219,0.45), transparent 68%)' }}
          animate={{ x: [0, 40, 0], y: [0, 28, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-[8%] top-[18%] h-[60vmin] w-[60vmin] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(79,128,255,0.4), transparent 68%)' }}
          animate={{ x: [0, -36, 0], y: [0, 22, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[35%] h-[50vmin] w-[50vmin] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(178,255,58,0.18), transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[6%] top-0 h-full w-[44%]"
          style={{
            background:
              'linear-gradient(105deg, transparent 0%, rgba(168,85,247,0.08) 35%, rgba(79,128,255,0.14) 55%, rgba(255,78,219,0.1) 75%, transparent 100%)',
          }}
          animate={{ opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-rosa">El gesto</p>
        <h2
          className="mt-4 max-w-4xl overflow-visible pb-1 text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.05em]"
          style={display}
        >
          Cinco segundos que explican PLIEGO.
        </h2>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <ol className="space-y-2">
            {frames.map((f, i) => (
              <motion.li
                key={f.t}
                animate={{
                  opacity: step === i ? 1 : 0.35,
                  x: step === i ? 12 : 0,
                }}
                className="border-l-2 pl-4"
                style={{ borderColor: step === i ? f.accent : 'rgba(255,255,255,0.12)' }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45">
                  0{i + 1}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-paper">{f.t}</p>
                <AnimatePresence>
                  {step === i ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-sm leading-relaxed text-paper/60"
                      style={serif}
                    >
                      {f.d}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            ))}
          </ol>

          <div className="relative">
            <motion.div
              className="pointer-events-none absolute -inset-6 rounded-2xl blur-2xl"
              animate={{
                background: [
                  `radial-gradient(circle at 40% 40%, ${accent}55, transparent 65%)`,
                  `radial-gradient(circle at 60% 50%, ${accent}33, transparent 70%)`,
                  `radial-gradient(circle at 40% 40%, ${accent}55, transparent 65%)`,
                ],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#0b0e11]/90 ring-1 ring-white/10 backdrop-blur-[2px]"
              style={{
                boxShadow: `0 0 0 1px ${accent}40, 0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}
            >
              <motion.div
                key={`wash-${step}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: `radial-gradient(ellipse 80% 70% at 70% 30%, ${accent}30, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(79,128,255,0.16), transparent 55%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(244,246,248,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(244,246,248,0.07) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute inset-0"
                >
                  {step === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <motion.span
                        className="text-6xl font-extrabold tracking-[-0.06em]"
                        style={{
                          ...display,
                          backgroundImage: 'var(--brand-flow)',
                          backgroundSize: '400% 100%',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                        animate={{ backgroundPosition: ['0% 50%', '66% 50%'], opacity: [0.35, 1, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      >
                        PLIEGO
                      </motion.span>
                    </div>
                  )}
                  {step === 1 && (
                    <>
                      <motion.div
                        className="absolute right-[12%] top-[18%] h-48 w-48 rounded-full bg-gradient-to-br from-rosa to-neon shadow-[0_0_60px_rgba(255,78,219,0.45)]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
                      />
                      <motion.div
                        className="absolute left-[10%] top-[42%] bg-[#152238] px-3 py-2"
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                      >
                        <span className="text-4xl font-extrabold tracking-tight" style={display}>
                          VOL.01
                        </span>
                      </motion.div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <motion.div
                        className="absolute right-[18%] top-[22%] h-40 w-40 rounded-full bg-violet/80 shadow-[0_0_50px_rgba(168,85,247,0.5)]"
                        animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute left-[14%] top-[38%] border border-neon px-3 py-2"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                      >
                        <span className="absolute -left-1 -top-1 h-2 w-2 bg-neon" />
                        <span className="absolute -right-1 -top-1 h-2 w-2 bg-neon" />
                        <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-neon" />
                        <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-neon" />
                        <span className="text-3xl font-bold">MOVE</span>
                      </motion.div>
                    </>
                  )}
                  {step === 3 && (
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                      {['v1 · draft', 'v2 · review', 'v3 · final'].map((v, i) => (
                        <motion.div
                          key={v}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className="w-56 rounded border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em]"
                          style={{ opacity: 0.4 + i * 0.3 }}
                        >
                          {v}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {step === 4 && (
                    <div className="flex h-full items-center justify-center p-8">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full max-w-sm rounded-sm border border-lima/50 bg-black/60 p-6 shadow-[0_0_40px_rgba(178,255,58,0.2)]"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-lima">
                          live link
                        </p>
                        <p className="mt-3 text-2xl font-bold tracking-tight" style={display}>
                          pliego.app/p/noche
                        </p>
                        <motion.div
                          className="mt-5 h-1 origin-left bg-lima"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.9, ease }}
                        />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export function LiveDemoPage() {
  const [intro, setIntro] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });
  const hook = useCycle(HOOKS.length, 2600);

  useEffect(() => {
    // Normal reading pace for short phrases (~1.4–1.6s each)
    const t1 = window.setTimeout(() => setIntro(1), 1500);
    const t2 = window.setTimeout(() => setIntro(2), 3100);
    const t3 = window.setTimeout(() => setIntro(3), 4800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-[#050608] text-paper">
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-neon via-rosa via-violet to-lima"
        style={{ scaleX: progress }}
      />

      {/* INTRO OVERLAY */}
      <AnimatePresence>
        {intro < 3 ? (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050608]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease }}
          >
            <AnimatePresence mode="wait">
              {intro === 0 && (
                <motion.p
                  key="a"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease }}
                  className="px-6 text-center text-3xl italic text-paper/85 sm:text-5xl"
                  style={serif}
                >
                  Diseñar en el browser
                </motion.p>
              )}
              {intro === 1 && (
                <motion.p
                  key="b"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease }}
                  className="px-6 text-center text-4xl font-extrabold tracking-[-0.04em] text-paper sm:text-6xl"
                  style={display}
                >
                  nunca se sintió así.
                </motion.p>
              )}
              {intro === 2 && (
                <motion.div
                  key="c"
                  initial={{ opacity: 0, letterSpacing: '0.28em' }}
                  animate={{ opacity: 1, letterSpacing: '-0.06em' }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.85, ease }}
                  className="text-center"
                >
                  <p
                    className="bg-gradient-to-r from-neon via-rosa to-lima bg-clip-text text-6xl font-extrabold text-transparent sm:text-8xl"
                    style={display}
                  >
                    PLIEGO
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="relative z-40 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/55 no-underline transition hover:bg-white/5 hover:text-paper"
          >
            <ArrowLeft size={14} /> Volver
          </Link>
          <Magnetic>
            <ButtonLink to="/register">
              Empezar <ArrowRight size={16} />
            </ButtonLink>
          </Magnetic>
        </div>
      </header>

      {/* BILLBOARD HERO */}
      <section className="relative z-10 flex min-h-[calc(100svh-80px)] flex-col justify-end overflow-hidden px-5 pb-16 pt-10 sm:px-8">
        <motion.div
          className="pointer-events-none absolute -right-24 top-10 h-[70vmin] w-[70vmin] rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(circle at 40% 40%, #FF4EDB 0%, #A855F7 35%, #4F80FF 60%, transparent 72%)',
          }}
          animate={{ scale: [1, 1.12, 1], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -left-16 bottom-20 h-[40vmin] w-[40vmin] rounded-full bg-lima/20 blur-3xl"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="min-h-[2.75rem] overflow-hidden sm:min-h-[3.25rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={HOOKS[hook]}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-lima sm:text-base md:text-lg"
              >
                {HOOKS[hook]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.8, ease }}
            className="mt-4 max-w-5xl overflow-visible pb-2 text-[clamp(3.2rem,12vw,8rem)] font-extrabold leading-[0.98] tracking-[-0.07em]"
            style={display}
          >
            Haz algo
            <br />
            <motion.span
              className="inline-block overflow-visible pb-[0.08em] text-transparent"
              style={{
                backgroundImage: 'var(--brand-flow)',
                backgroundSize: '400% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            >
              que se recuerde.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.95, duration: 0.7, ease }}
            className="mt-8 max-w-xl text-xl leading-snug text-paper/70 sm:text-2xl"
            style={serif}
          >
            PLIEGO es el estudio editorial donde tipografía, vector y motion se publican juntos —
            en el browser, con cara de campaña.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.15, duration: 0.6, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.35}>
              <ButtonLink to="/register" className="px-7 py-3.5 text-base">
                Quiero crear ahora <ArrowRight size={18} />
              </ButtonLink>
            </Magnetic>
            <a
              href="#obra"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50 no-underline transition hover:text-paper"
            >
              Ver la obra ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* STATEMENT STRIP — single motion band on the live demo */}
      <section className="marquee-stack relative z-10">
        <Marquee
          items={[
            'Manifiesto digital',
            'Portfolio que vende',
            'Portadas que paran',
            'Páginas de revista',
            'Catálogo / lookbook',
            'Presentación que cierra',
          ]}
          speed={48}
          tone={2}
        />
      </section>

      {/* MANIFESTO */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-neon"
        >
          Manifiesto
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
          className="mt-6 text-[clamp(2rem,6vw,4.2rem)] font-extrabold leading-[1.05] tracking-[-0.045em]"
          style={display}
        >
          Si tu diseño cabe en un screenshot aburrido,
          <span className="text-paper/35"> todavía no es PLIEGO.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7, ease }}
          className="mx-auto mt-8 max-w-2xl text-xl text-paper/65"
          style={serif}
        >
          Aquí el canvas no imita un documento gris: imita una pieza impresa, una campaña, una
          portada que alguien querría colgar.
        </motion.p>
      </section>

      {/* PRODUCT CHAPTERS — compact gallery */}
      <ChapterGallery />

      <GestureFilm />

      {/* CLOSING BILLBOARD */}
      <section className="relative z-10 flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,78,219,0.25), transparent 60%)',
          }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative font-mono text-[11px] uppercase tracking-[0.28em] text-naranja"
        >
          Ahora
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease }}
          className="relative mt-5 max-w-4xl overflow-visible pb-2 text-[clamp(3rem,10vw,7rem)] font-extrabold leading-[0.98] tracking-[-0.07em]"
          style={display}
        >
          Tu próximo
          <br />
          <motion.span
            className="inline-block overflow-visible pb-[0.08em] text-transparent"
            style={{
              backgroundImage: 'var(--brand-flow)',
              backgroundSize: '400% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          >
            trabajo famoso
          </motion.span>
          <br />
          empieza aquí.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="relative mt-8 max-w-md text-lg text-paper/65"
          style={serif}
        >
          Abre el estudio. Elige una plantilla. Publica algo que alguien quiera reenviar.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="relative mt-10 flex flex-wrap justify-center gap-3"
        >
          <Magnetic strength={0.4}>
            <ButtonLink to="/register" className="min-w-56 px-8 py-4 text-base">
              Crear mi cuenta <ArrowRight size={18} />
            </ButtonLink>
          </Magnetic>
          <ButtonLink to="/login" variant="soft" className="px-8 py-4">
            Ya tengo acceso
          </ButtonLink>
        </motion.div>
      </section>
    </div>
  );
}

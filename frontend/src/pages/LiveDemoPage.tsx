import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo, ButtonLink } from '../components/ui/primitives';
import { Magnetic } from '../components/creative/Motion';

const ease = [0.16, 1, 0.3, 1] as const;
const BEATS = ['DISEÑA', 'COMPÓN', 'VERSIONA', 'PUBLICA'] as const;

export function LiveDemoPage() {
  const [beat, setBeat] = useState(0);
  const { scrollYProgress } = useScroll();
  const orbY = useSpring(useTransform(scrollYProgress, [0, 0.45], [0, 120]), {
    stiffness: 60,
    damping: 20,
  });
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.25]);

  useEffect(() => {
    const id = window.setInterval(() => setBeat((i) => (i + 1) % BEATS.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-[#07090c] text-paper">
      <div className="pointer-events-none fixed inset-0 mesh-bg opacity-70" />

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

      {/* Scene 1 — living portada */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-7xl items-center gap-10 px-5 pb-20 pt-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-lima"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-lima"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            Demo viva · publicación
          </motion.p>

          <div className="relative mt-6 min-h-[4.5rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={BEATS[beat]}
                initial={{ y: 48, opacity: 0, rotate: -1.5 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -36, opacity: 0, rotate: 1.5 }}
                transition={{ duration: 0.55, ease }}
                className="font-display text-[clamp(3.4rem,12vw,7rem)] font-bold leading-[0.86] tracking-[-0.07em]"
              >
                {BEATS[beat]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            className="mt-2 font-display text-[clamp(2.4rem,8vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-transparent"
            style={{
              backgroundImage: 'var(--brand-flow)',
              backgroundSize: '400% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
            animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            SIN LÍMITES
          </motion.p>

          <p
            className="mt-1 font-display text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-transparent"
            style={{ WebkitTextStroke: '1.5px rgba(244,246,248,0.45)' }}
          >
            EN EL BROWSER
          </p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="mt-7 max-w-md text-lg leading-snug text-paper/70"
          >
            Tipografía, vectores y capas con el mismo lenguaje visual de una pieza editorial —
            pero en movimiento, lista para publicar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Magnetic strength={0.3}>
              <ButtonLink to="/register" className="px-6 py-3 text-base">
                Empezar a diseñar <ArrowRight size={18} />
              </ButtonLink>
            </Magnetic>
            <a
              href="#escenas"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55 no-underline transition hover:bg-white/5 hover:text-paper"
            >
              Ver escenas ↓
            </a>
          </motion.div>
        </div>

        {/* Living artboard — same DNA as the hero card, amplified */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease }}
          className="relative mx-auto aspect-square w-full max-w-lg"
        >
          <div className="absolute -inset-10 rounded-[2rem] bg-gradient-to-br from-neon/30 via-rosa/20 to-lima/15 blur-3xl" />
          <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-[#0b0e11] shadow-[0_40px_120px_rgba(0,0,0,0.55)] [isolation:isolate]">
            <motion.div
              className="absolute inset-y-0 left-0 z-[3] w-[12px]"
              style={{ backgroundImage: 'var(--brand-flow)', backgroundSize: '400% 100%' }}
              animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 z-[3] h-[12px]"
              style={{ backgroundImage: 'var(--brand-flow)', backgroundSize: '400% 100%' }}
              animate={{ backgroundPosition: ['0% 50%', '66.6667% 50%'] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="pliego-orb-live absolute -right-[18%] top-[10%] z-[1] aspect-square w-[78%] rounded-full"
              style={{ y: orbY, scale: orbScale }}
            />

            <motion.div
              className="absolute left-7 top-6 z-[4] rounded-[4px] border border-white/25 bg-[#121826]/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              01 / 04
            </motion.div>

            <div className="absolute left-7 top-[36%] z-[4] max-w-[82%]">
              <motion.div
                className="inline-block bg-[#152238] px-3 py-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.7, ease }}
              >
                <span className="font-display text-[clamp(2.6rem,9vw,3.8rem)] font-bold leading-none tracking-[-0.06em]">
                  PLiEGO
                </span>
              </motion.div>
              <motion.div
                className="mt-3 inline-block bg-[#152238] px-2.5 py-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease }}
              >
                <span className="text-base font-medium">Diseño editorial.</span>
              </motion.div>
              <motion.div
                className="mt-2 inline-block bg-[#152238] px-2.5 py-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.52, duration: 0.7, ease }}
              >
                <span className="text-base font-medium">Tecnología. Sin límites.</span>
              </motion.div>
            </div>

            {/* Floating vector chips */}
            <motion.div
              className="absolute bottom-[22%] left-8 z-[4] rounded-md border border-neon/70 bg-ink/50 px-2.5 py-1.5 backdrop-blur-md"
              animate={{ y: [0, -12, 0], rotate: [-2, 1, -2] }}
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
              className="absolute bottom-[28%] right-8 z-[4] flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md"
              animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="h-2 w-2 rounded-full bg-rosa" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/75">
                vector
              </span>
            </motion.div>

            <motion.div
              className="pointer-events-none absolute z-[5]"
              animate={{ x: [56, 240, 170, 56], y: [140, 190, 280, 140] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                <path
                  d="M1 1l15 8.2-6.6 1.6L7.2 21 1 1z"
                  fill="#F4F6F8"
                  stroke="#0B0E11"
                  strokeWidth="1"
                />
              </svg>
              <div className="ml-3 mt-1 whitespace-nowrap rounded bg-paper px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-ink">
                edit
              </div>
            </motion.div>

            <div className="absolute bottom-6 right-5 z-[4] inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
              <span className="h-1.5 w-1.5 rounded-full bg-lima" />
              demo viva
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scene strip */}
      <section id="escenas" className="relative z-10 border-t border-white/8 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-rosa">Escenas</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Una publicación que se siente viva.
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                k: '02',
                t: 'Tipografía con carácter',
                d: 'Display, outline y degradado de marca en la misma composición — jerarquía clara, cero relleno.',
                accent: 'text-neon',
              },
              {
                k: '03',
                t: 'Vectores en escena',
                d: 'Marcas de selección, chips de capa y un cursor fantasma: el canvas cuenta que alguien está diseñando.',
                accent: 'text-rosa',
              },
              {
                k: '04',
                t: 'Motion con intención',
                d: 'Entradas, órbita del color y micro-movimientos. No decoración: ritmo editorial.',
                accent: 'text-lima',
              },
            ].map((card, i) => (
              <motion.article
                key={card.k}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: i * 0.08, duration: 0.65, ease }}
                className="relative overflow-hidden rounded-2xl border border-white/8 bg-ink-2/80 p-6"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-neon/10 blur-2xl" />
                <p className={`font-mono text-[11px] tracking-[0.2em] ${card.accent}`}>{card.k}</p>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{card.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">{card.d}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Typography wall */}
      <section className="relative z-10 overflow-hidden border-t border-white/8 py-28">
        <motion.div
          className="pointer-events-none absolute -left-10 top-10 select-none font-display text-[9rem] font-bold leading-none tracking-[-0.08em] text-transparent opacity-40 sm:text-[12rem]"
          style={{ WebkitTextStroke: '1.5px rgba(244,246,248,0.12)' }}
          animate={{ x: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        >
          VOL.01
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neon">Mensaje</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              No es un panel.
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
                Es una pieza.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-paper/65">
              PLIEGO trata la interfaz como composición: capas, tipografía y color corporativo
              trabajando juntos — en el editor y en lo que publicas.
            </p>
          </motion.div>

          <div className="mt-16 flex flex-wrap gap-3">
            {['Capas', 'Type', 'Motion', 'PDF', 'Link vivo', 'Plantillas'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i, duration: 0.45, ease }}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative z-10 border-t border-white/8 py-28">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-naranja">Tu turno</p>
            <h2 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-7xl">
              Haz que se note.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-paper/65">
              Abre el estudio, elige una plantilla y publica una pieza con el mismo pulso que esta
              demo.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Magnetic strength={0.35}>
                <ButtonLink to="/register" className="min-w-48 px-6 py-3 text-base">
                  Crear cuenta <ArrowRight size={18} />
                </ButtonLink>
              </Magnetic>
              <ButtonLink to="/login" variant="soft" className="px-6 py-3">
                Entrar
              </ButtonLink>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

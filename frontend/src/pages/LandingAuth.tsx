import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Play } from 'lucide-react';
import { Logo, Button, ButtonLink, Input, PliegoWordmark, PliegoMark, PliegoHeroWordmark } from '../components/ui/primitives';
import { CursorGlow, Magnetic, Marquee, Reveal } from '../components/creative/Motion';
import { useAuthStore } from '../stores/authStore';

const ease = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    k: '01',
    t: 'Canvas vivo',
    d: 'Arrastra tipografía, formas e imágenes con undo/redo y capas. El editor responde como un estudio.',
    accent: '#4f80ff',
  },
  {
    k: '02',
    t: 'Flujo completo',
    d: 'Autoguardado, versiones, exportación PDF y publicación pública sin salir del navegador.',
    accent: '#ff4edb',
  },
  {
    k: '03',
    t: 'Identidad fuerte',
    d: 'Mesh de marca, tipografía display y microinteracciones que mantienen la esencia de campaña.',
    accent: '#b2ff3a',
  },
] as const;

function FeatureCard({
  k,
  t,
  d,
  accent,
}: {
  k: string;
  t: string;
  d: string;
  accent: string;
}) {
  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <article
      className="feature-card rounded-2xl p-6 sm:p-7"
      style={{ '--feature-accent': accent } as React.CSSProperties}
      onPointerMove={onMove}
    >
      <div className="feature-card-sheen" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-1.5 origin-left"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent 88%)`,
          boxShadow: `0 0 22px ${accent}66`,
        }}
      />
      <p className="relative font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: accent }}>
        {k}
      </p>
      <h3 className="relative mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{t}</h3>
      <p className="relative mt-3 font-serif text-base leading-relaxed text-paper/60">{d}</p>
    </article>
  );
}

export function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.42]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, 48]);

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-ink text-paper">
      <CursorGlow />

      {/* Atmosphere stack — depth, not flat ink */}
      <div className="pointer-events-none fixed inset-0 mesh-bg opacity-[0.88]" />
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="landing-orb landing-orb-a" />
        <div className="landing-orb landing-orb-b" />
        <div className="landing-orb landing-orb-c" />
      </div>
      <div className="pointer-events-none fixed inset-0 landing-grid opacity-70" aria-hidden />
      <div className="pointer-events-none fixed inset-0 landing-grain" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% -5%, transparent 20%, rgba(5,6,8,0.55) 78%), linear-gradient(180deg, transparent 40%, rgba(5,6,8,0.72) 100%)',
        }}
      />

      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2">
          {user ? (
            <Magnetic>
              <ButtonLink to="/app">
                Abrir estudio <ArrowRight size={16} />
              </ButtonLink>
            </Magnetic>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70 no-underline transition hover:bg-white/5 hover:text-paper"
              >
                Entrar
              </Link>
              <Magnetic>
                <ButtonLink to="/register">
                  Crear cuenta <ArrowRight size={16} />
                </ButtonLink>
              </Magnetic>
            </>
          )}
        </nav>
      </header>

      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-7xl flex-col justify-center px-5 pb-20 pt-6 sm:px-8"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <PliegoMark size={44} className="shrink-0" />
            <p className="eyebrow text-neon">Editorial studio · browser native</p>
            <span className="hero-signal ml-0 sm:ml-2">
              <span className="hero-signal-dot" aria-hidden />
              Sistema en vivo
            </span>
            <span className="hidden h-px min-w-16 flex-1 bg-gradient-to-r from-neon/45 via-rosa/25 to-transparent sm:block" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="mt-7"
          >
            <PliegoHeroWordmark />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="mt-7 max-w-xl font-serif text-xl leading-snug text-paper/75 sm:text-2xl"
          >
            Diseña revistas, portadas y sistemas visuales con la fluidez de un estudio creativo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.35}>
              <ButtonLink to={user ? '/app' : '/register'} className="min-w-48 px-6 py-3 text-base">
                Empezar a diseñar <ArrowRight size={18} />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink to="/demo" variant="soft" className="px-6 py-3">
                <Play size={15} /> Ver demo viva
              </ButtonLink>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-14 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45"
          >
            {['Canvas vivo', 'Publish al instante', 'Identidad de campaña'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_rgba(79,128,255,0.65)]" />
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.a
            href="#studio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 inline-flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-paper no-underline transition hover:text-neon"
          >
            Explorar el sistema <ArrowDownRight size={15} />
          </motion.a>
        </div>
      </motion.section>

      {/* Chromatic band — intentional color energy lives here */}
      <div className="relative z-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/55 to-transparent" />
        <Marquee
          items={['Tipografía', 'Capas', 'Versiones', 'PDF', 'Publicación', 'Plantillas', 'Canvas']}
          speed={28}
          colorOffset={0}
          phaseDelay={0}
        />
        <Marquee
          items={['Readymag energy', 'Studio flow', 'Neon mesh', 'Design systems', 'Editorial UI']}
          speed={40}
          reverse
          colorOffset={2}
          phaseDelay={1600}
          chrome="bottom"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rosa/55 to-transparent" />
      </div>

      <section id="studio" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-index">01 — Sistema</p>
              <p className="eyebrow mt-3 text-rosa">Por qué PLIEGO</p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
                Una herramienta útil que se siente como una{' '}
                <span className="wordmark-cutout">pieza de diseño</span>.
              </h2>
              <p className="mt-5 max-w-xl font-serif text-xl text-paper/65">
                La misma disciplina visual de la demo, aplicada a tu flujo diario.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {FEATURES.map((card, i) => (
            <Reveal key={card.k} delay={i * 0.08}>
              <FeatureCard {...card} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute inset-0 cta-wash" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="signal-frame rounded-3xl px-6 py-10 sm:px-12 sm:py-14">
              <p className="section-index">02 — Acción</p>
              <p className="eyebrow mt-3 text-lima">Siguiente paso</p>
              <h2 className="mt-4 max-w-4xl font-display text-5xl font-extrabold tracking-[-0.055em] sm:text-7xl">
                Crea. Publica.
                <span className="wordmark-cutout"> Revoluciona.</span>
              </h2>
              <p className="mt-6 max-w-xl font-serif text-xl leading-snug text-paper/65">
                Tipografía enorme, movimiento intencional e interfaces que invitan a explorar —
                con cara de campaña, no de panel.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Magnetic strength={0.4}>
                  <ButtonLink to={user ? '/app' : '/register'} className="px-8 py-3.5 text-base">
                    Entrar al canvas <ArrowRight size={18} />
                  </ButtonLink>
                </Magnetic>
                <Magnetic>
                  <ButtonLink to="/demo" variant="soft" className="px-8 py-3.5 text-base">
                    <Play size={15} /> Ver demo viva
                  </ButtonLink>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="relative z-10 px-5 py-10 sm:px-8">
        <div className="mx-auto h-1 max-w-7xl rounded-full bg-gradient-to-r from-neon via-rosa to-lima opacity-70" />
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PliegoWordmark className="text-lg" variant="gradient" />
          <p className="eyebrow text-paper/35">Diseño editorial · Tecnología · Sin límites</p>
        </div>
      </footer>
    </div>
  );
}

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <CursorGlow />
      <aside className="relative hidden overflow-hidden mesh-bg lg:block">
        <div className="absolute inset-0 bg-ink/25" />
        <motion.div
          className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-neon/12 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-rosa/10 blur-3xl"
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo />
          <div>
            <p className="eyebrow text-lima">Studio · Create · Publish</p>
            <PliegoWordmark variant="gradient" className="mt-6 text-6xl xl:text-8xl" />
            <p className="mt-6 max-w-sm font-serif text-xl leading-relaxed text-paper/75">
              Ideas que se transforman en proyectos editoriales interactivos.
            </p>
          </div>
          <div className="editorial-rule w-40" />
        </div>
      </aside>

      <div className="relative grid place-items-center bg-ink mesh-bg-soft px-5 py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(5,6,8,0.35),transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease }}
          className="relative w-full max-w-md"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <PliegoMark size={32} />
            <PliegoWordmark />
          </div>
          <p className="eyebrow text-neon">Acceso</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 font-serif text-lg leading-relaxed text-paper/65">{subtitle}</p>
          <div className="editorial-rule mt-6 mb-2 w-20" />
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@pliego.app');
  const [password, setPassword] = useState('demo1234');

  return (
    <AuthShell title="Entrar al estudio" subtitle="Continúa tus proyectos editoriales.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await login(email, password);
            navigate('/app');
          } catch {
            /* handled */
          }
        }}
      >
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Magnetic className="block" strength={0.2}>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Iniciar sesión'}
            <ArrowRight size={16} />
          </Button>
        </Magnetic>
      </form>
      <p className="mt-7 text-sm text-paper-muted">
        ¿Nuevo en PLIEGO?{' '}
        <Link to="/register" className="font-semibold text-neon no-underline hover:underline">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}

export function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthShell title="Crear cuenta" subtitle="Abre tu estudio y empieza a componer.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await register(name, email, password);
            navigate('/app');
          } catch {
            /* handled */
          }
        }}
      >
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Contraseña"
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Magnetic className="block" strength={0.2}>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Creando…' : 'Registrarme'}
            <ArrowRight size={16} />
          </Button>
        </Magnetic>
      </form>
      <p className="mt-7 text-sm text-paper-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-neon no-underline hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}

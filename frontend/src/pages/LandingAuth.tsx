import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Logo, Button, ButtonLink, Input, PliegoWordmark, PliegoMark } from '../components/ui/primitives';
import { useAuthStore } from '../stores/authStore';

const ease = [0.16, 1, 0.3, 1] as const;

export function LandingPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative min-h-svh overflow-hidden mesh-bg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,14,17,0.35)_70%,rgba(11,14,17,0.75)_100%)]" />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-2">
          {user ? (
            <ButtonLink to="/app">
              Ir al estudio
              <ArrowRight size={16} />
            </ButtonLink>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-paper no-underline transition hover:bg-white/5"
              >
                Entrar
              </Link>
              <ButtonLink to="/register">
                Crear cuenta
                <ArrowRight size={16} />
              </ButtonLink>
            </>
          )}
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100svh-96px)] w-full max-w-6xl flex-col justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-paper/80">
            Plataforma editorial visual
          </p>
          <h1 className="mt-5">
            <PliegoWordmark
              variant="gradient"
              className="block text-[clamp(3.5rem,14vw,8.5rem)] leading-[0.88]"
            />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85 sm:text-xl">
            Diseño editorial. Tecnología. Sin límites.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper-muted">
            Crea, diseña y publica proyectos editoriales digitales desde el navegador.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to={user ? '/app' : '/register'} className="min-w-44">
              Empezar a diseñar
              <ArrowRight size={16} />
            </ButtonLink>
            <ButtonLink to="/p/portada-demo-pliego" variant="soft">
              Ver demo publicada
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-16 grid max-w-3xl gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55 sm:grid-cols-3"
        >
          <span>Crear</span>
          <span>Diseñar</span>
          <span>Publicar</span>
        </motion.div>
      </main>
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
      <aside className="relative hidden overflow-hidden mesh-bg lg:block">
        <div className="absolute inset-0 bg-ink/20" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo />
          <div>
            <PliegoWordmark variant="gradient" className="text-6xl xl:text-7xl" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/80">
              Ideas que se transforman en proyectos editoriales.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
            Diseño editorial · Tecnología · Sin límites
          </p>
        </div>
      </aside>

      <div className="relative grid place-items-center bg-ink px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <PliegoMark size={32} />
            <PliegoWordmark />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-paper-muted">{subtitle}</p>
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
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Iniciar sesión'}
          <ArrowRight size={16} />
        </Button>
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
    <AuthShell title="Crear cuenta" subtitle="Empieza a diseñar proyectos editoriales digitales.">
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
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creando…' : 'Registrarme'}
          <ArrowRight size={16} />
        </Button>
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

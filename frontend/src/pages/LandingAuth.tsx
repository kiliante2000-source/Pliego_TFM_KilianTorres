import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Logo, Button, ButtonLink, Input } from '../components/ui/primitives';
import { useAuthStore } from '../stores/authStore';

const ease = [0.16, 1, 0.3, 1] as const;

export function LandingPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative min-h-svh overflow-hidden">
      {/* Full-bleed editorial plane */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[54%]">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease }}
            className="relative h-full min-h-svh overflow-hidden bg-[#0c0b0a]"
          >
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(244,238,230,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(244,238,230,0.5) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.85, delay: 0.25, ease }}
              className="absolute inset-x-0 bottom-0 h-[32%] origin-bottom bg-accent"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="absolute left-[8%] top-[18%] right-[10%]"
            >
              <p className="font-display text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-paper">
                PLIEGO
              </p>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-paper-muted sm:text-lg">
                Diseño editorial desde el navegador
              </p>
            </motion.div>
            <div className="absolute bottom-[10%] left-[8%] text-[11px] font-bold tracking-[0.28em] text-ink">
              Nº 01 · COLECCIÓN VISUAL
            </div>
          </motion.div>
        </div>
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <ButtonLink to="/app">Ir al estudio</ButtonLink>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-paper-muted no-underline transition hover:bg-ink-3/60 hover:text-paper"
              >
                Entrar
              </Link>
              <ButtonLink to="/register">Crear cuenta</ButtonLink>
            </>
          )}
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100svh-88px)] w-full max-w-6xl items-center px-6 pb-16 pt-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="w-full max-w-xl text-left lg:w-[46%]"
        >
          <p className="font-display text-[clamp(3.25rem,9vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-paper">
            Pliego
          </p>
          <h1 className="mt-6 max-w-md text-lg font-medium leading-snug text-paper-muted sm:text-xl">
            Maqueta, versiona y publica piezas editoriales con la fluidez de un estudio digital.
          </h1>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to={user ? '/app' : '/register'} className="min-w-44">
              Empezar a diseñar
            </ButtonLink>
            <ButtonLink to="/p/portada-demo-pliego" variant="soft">
              Ver demo publicada
            </ButtonLink>
          </div>
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
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0c0b0a] lg:block">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(244,238,230,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(244,238,230,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-accent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <div>
            <p className="font-display text-5xl font-semibold leading-none tracking-tight text-paper xl:text-6xl">
              El taller
              <br />
              editorial
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper-muted">
              Capas, tipografía, versiones y publicación en un solo flujo de trabajo.
            </p>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-ink">PLIEGO · STUDIO</p>
        </div>
      </aside>

      <div className="relative grid place-items-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
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
    <AuthShell title="Entrar al estudio" subtitle="Continúa tus proyectos editoriales donde los dejaste.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await login(email, password);
            navigate('/app');
          } catch {
            /* store handles error */
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
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Iniciar sesión'}
        </Button>
      </form>
      <p className="mt-7 text-sm text-paper-muted">
        ¿Nuevo en Pliego?{' '}
        <Link to="/register" className="font-semibold text-accent no-underline hover:underline">
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
    <AuthShell title="Crear cuenta" subtitle="Abre tu estudio y empieza a componer en minutos.">
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
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Creando…' : 'Registrarme'}
        </Button>
      </form>
      <p className="mt-7 text-sm text-paper-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-accent no-underline hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}

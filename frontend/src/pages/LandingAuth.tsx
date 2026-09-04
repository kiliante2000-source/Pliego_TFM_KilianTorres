import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Logo, Button, ButtonLink, Input } from '../components/ui/primitives';
import { useAuthStore } from '../stores/authStore';

export function LandingPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(242,235,227,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(242,235,227,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-3">
          {user ? (
            <ButtonLink to="/app">Ir al estudio</ButtonLink>
          ) : (
            <>
              <Link to="/login" className="text-sm text-paper-muted no-underline hover:text-paper">
                Entrar
              </Link>
              <ButtonLink to="/register">Crear cuenta</ButtonLink>
            </>
          )}
        </nav>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-left"
        >
          <p className="mb-5 font-display text-5xl leading-[0.95] tracking-tight text-paper sm:text-7xl">
            Pliego
          </p>
          <h1 className="max-w-xl text-xl font-medium leading-snug text-paper-muted sm:text-2xl">
            Composición editorial digital con la precisión de un estudio y la fluidez de un producto SaaS.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper-muted/80">
            Crea páginas, organiza capas, versiona documentos, exporta a PDF y publica con un enlace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={user ? '/app' : '/register'} className="min-w-40">
              Empezar a diseñar
            </ButtonLink>
            <ButtonLink to="/p/portada-demo-pliego" variant="soft">
              Ver publicación demo
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          aria-hidden
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-accent/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-ink-2 shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="ml-3 text-xs text-paper-muted">editor · portada</span>
            </div>
            <div className="grid aspect-[4/5] place-items-center bg-[#0f0e0c] p-8">
              <div className="relative h-full w-full max-w-sm overflow-hidden bg-[#0c0b0a]">
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-accent" />
                <div className="absolute left-8 top-16 font-display text-5xl text-paper">PLIEGO</div>
                <div className="absolute left-8 top-36 max-w-[14rem] text-sm leading-relaxed text-paper-muted">
                  Diseño editorial desde el navegador
                </div>
                <div className="absolute bottom-10 left-8 text-xs font-semibold tracking-[0.18em] text-ink">
                  Nº 01 · COLECCIÓN VISUAL
                </div>
              </div>
            </div>
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
    <div className="grid min-h-svh place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-ink-2/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <Logo className="mb-8" />
        <h1 className="font-display text-3xl text-paper">{title}</h1>
        <p className="mt-2 text-sm text-paper-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
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
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Iniciar sesión'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-paper-muted">
        ¿Nuevo en Pliego?{' '}
        <Link to="/register" className="text-accent no-underline hover:underline">
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
    <AuthShell title="Crear cuenta" subtitle="Empieza a maquetar en minutos.">
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
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? 'Creando…' : 'Registrarme'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-paper-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-accent no-underline hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}

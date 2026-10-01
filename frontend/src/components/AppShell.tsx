import { NavLink, Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  FolderKanban,
  LayoutTemplate,
  Image as ImageIcon,
  History,
  Settings,
  LogOut,
} from 'lucide-react';
import { Logo, Button, PliegoMark } from './ui/primitives';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../utils/cn';

const nav = [
  { id: 'projects', to: '/app?tab=projects#studio-hello', label: 'Proyectos', short: 'Proy.', icon: FolderKanban },
  { id: 'templates', to: '/app?tab=templates#coleccion-plantillas', label: 'Plantillas', short: 'Plant.', icon: LayoutTemplate },
  { id: 'assets', to: '/app?tab=assets#studio-hello', label: 'Recursos', short: 'Rec.', icon: ImageIcon },
  { id: 'versions', to: '/app?tab=versions#studio-hello', label: 'Versiones', short: 'Ver.', icon: History },
  { id: 'settings', to: '/app?tab=settings#studio-hello', label: 'Ajustes', short: 'Aj.', icon: Settings },
] as const;

function isNavActive(itemId: string, tab: string | null) {
  const active = tab || 'projects';
  return active === itemId;
}

export function AppShell() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();

  return (
    <div className="flex min-h-svh bg-ink mesh-bg-soft">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-white/8 bg-ink/80 px-4 py-6 backdrop-blur-xl md:flex">
        <div className="mb-10 px-2">
          <Logo to="/app?tab=projects#studio-hello" />
          <p className="eyebrow mt-3 text-paper/70">Studio</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const isActive = location.pathname === '/app' && isNavActive(item.id, params.get('tab'));
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-full px-3.5 py-2.5 text-base font-medium no-underline transition',
                  isActive
                    ? 'nav-pill-active'
                    : 'text-paper/75 hover:bg-white/5 hover:text-paper',
                )}
              >
                <item.icon size={18} strokeWidth={1.75} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/8 px-2 pt-5">
          <div className="rounded-xl border border-white/8 bg-ink-2/50 px-3 py-2.5">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-paper/45">
              Estudio vivo
            </p>
            <p className="mt-1 text-sm text-paper/70">
              Tipografía · motion · publicación
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <PliegoMark size={32} />
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold tracking-tight text-paper">
                {user?.name}
              </p>
              <p className="truncate font-mono text-base text-paper/70">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={async () => {
              await logout();
              navigate('/');
            }}
          >
            <LogOut size={16} />
            Salir
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sticky mobile chrome — stays with you while scrolling */}
        <div
          data-studio-sticky
          className="sticky top-0 z-40 border-b border-white/8 bg-ink/95 backdrop-blur-xl md:hidden"
        >
          <header className="flex items-center justify-between gap-2 px-3 py-2.5">
            <Logo
              to="/app"
              markSize={22}
              wordmarkClassName="text-[1.05rem]"
              className="min-w-0"
            />
            <Button
              variant="ghost"
              className="shrink-0 px-2.5 py-2"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              aria-label="Salir"
            >
              <LogOut size={16} />
            </Button>
          </header>

          <nav className="flex gap-1 overflow-x-auto px-2 pb-2 scrollbar-thin">
            {nav.map((item) => {
              const isActive = isNavActive(item.id, params.get('tab'));
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] no-underline',
                    isActive ? 'nav-pill-active' : 'text-paper/70',
                  )}
                >
                  <item.icon size={13} strokeWidth={2} />
                  {item.short}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

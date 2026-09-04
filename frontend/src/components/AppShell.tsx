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
  { id: 'projects', to: '/app', label: 'Proyectos', icon: FolderKanban },
  { id: 'templates', to: '/app?tab=templates', label: 'Plantillas', icon: LayoutTemplate },
  { id: 'assets', to: '/app?tab=assets', label: 'Recursos', icon: ImageIcon },
  { id: 'versions', to: '/app?tab=versions', label: 'Versiones', icon: History },
  { id: 'settings', to: '/app?tab=settings', label: 'Ajustes', icon: Settings },
] as const;

export function AppShell() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const activeTab = params.get('tab') || 'projects';

  return (
    <div className="flex min-h-svh bg-ink mesh-bg-soft">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-line bg-ink/90 px-3 py-5 md:flex">
        <div className="mb-8 px-2">
          <Logo to="/app" />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-muted">
            Studio
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const isActive =
              location.pathname === '/app' &&
              (item.id === 'projects' ? !params.get('tab') : activeTab === item.id);
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-medium no-underline transition',
                  isActive
                    ? 'nav-pill-active'
                    : 'text-paper-muted hover:bg-ink-3 hover:text-paper',
                )}
              >
                <item.icon size={17} strokeWidth={1.75} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-line px-2 pt-4">
          <div className="flex items-center gap-2.5">
            <PliegoMark size={32} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-paper">{user?.name}</p>
              <p className="truncate font-mono text-[10px] text-paper-muted">{user?.email}</p>
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
        <header className="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
          <Logo to="/app" />
          <Button
            variant="ghost"
            onClick={async () => {
              await logout();
              navigate('/');
            }}
          >
            <LogOut size={16} />
          </Button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2 md:hidden scrollbar-thin">
          {nav.map((item) => {
            const isActive =
              item.id === 'projects' ? !params.get('tab') : activeTab === item.id;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] no-underline',
                  isActive ? 'nav-pill-active' : 'text-paper-muted',
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

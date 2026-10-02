import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { openLiveStudio } from '../lib/liveOrigin';

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <div className="grid min-h-svh place-items-center text-paper/70">
        Cargando sesión…
      </div>
    );
  }

  if (!user) {
    if (openLiveStudio(`/login?from=${encodeURIComponent(location.pathname)}`)) {
      return (
        <div className="grid min-h-svh place-items-center text-paper/70">
          Abriendo el estudio…
        </div>
      );
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

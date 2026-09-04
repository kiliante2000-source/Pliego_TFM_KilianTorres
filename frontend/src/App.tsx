import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage, LoginPage, RegisterPage } from './pages/LandingAuth';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { PublicProjectPage } from './pages/PublicProjectPage';
import { AppShell } from './components/AppShell';

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/p/:slug" element={<PublicProjectPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/app" element={<DashboardPage />} />
          </Route>
          <Route path="/app/editor/:projectId" element={<EditorPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

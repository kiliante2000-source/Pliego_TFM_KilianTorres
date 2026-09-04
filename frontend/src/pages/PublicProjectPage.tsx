import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Project } from '../types/document';
import { PublicRenderer } from '../components/editor/PublicRenderer';
import { Logo } from '../components/ui/primitives';

export function PublicProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get<{ project: Project }>(`/api/public/${slug}`)
      .then((data) => setProject(data.project))
      .catch((e) => setError(e instanceof Error ? e.message : 'No encontrado'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="grid min-h-svh place-items-center text-paper-muted">Cargando publicación…</div>;
  }

  if (error || !project) {
    return (
      <div className="grid min-h-svh place-items-center px-6 text-center">
        <div>
          <Logo className="mb-6 justify-center" />
          <p className="text-paper-muted">{error || 'Publicación no disponible'}</p>
          <Link to="/" className="mt-4 inline-block text-accent no-underline hover:underline">
            Volver a Pliego
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-ink">
      <header className="border-b border-line/70 bg-ink/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="text-right">
            <p className="text-sm text-paper">{project.title}</p>
            <p className="text-xs text-paper-muted">por {project.authorName || 'autor'}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <PublicRenderer document={project.document} />
      </main>
    </div>
  );
}

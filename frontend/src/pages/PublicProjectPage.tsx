import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { Project } from '../types/document';
import { PublicRenderer } from '../components/editor/PublicRenderer';
import { Logo, ButtonLink, PliegoWordmark } from '../components/ui/primitives';

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
    return (
      <div className="grid min-h-svh place-items-center font-mono text-xs uppercase tracking-[0.18em] text-paper-muted">
        Cargando publicación…
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="grid min-h-svh place-items-center px-6 text-center mesh-bg-soft">
        <div>
          <Logo className="mb-6 justify-center" />
          <p className="font-display text-2xl font-bold text-paper">Publicación no disponible</p>
          <p className="mt-2 text-sm text-paper-muted">
            {error || 'El enlace no es válido o está desactivado.'}
          </p>
          <ButtonLink to="/" className="mt-6">
            Volver a PLIEGO
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-ink">
      <header className="border-b border-line/60 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Logo />
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium text-paper">{project.title}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-muted">
              por {project.authorName || 'autor'}
            </p>
          </div>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl px-6 py-10"
      >
        <PublicRenderer document={project.document} />
        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted">
          Publicado con{' '}
          <Link to="/" className="text-neon no-underline hover:underline">
            <PliegoWordmark className="inline text-sm" variant="gradient" />
          </Link>
        </p>
      </motion.main>
    </div>
  );
}

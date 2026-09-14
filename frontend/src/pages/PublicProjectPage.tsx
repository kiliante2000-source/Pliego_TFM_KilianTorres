import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { Project } from '../types/document';
import { PublicRenderer } from '../components/editor/PublicRenderer';
import { Logo, ButtonLink, PliegoWordmark, BrandName } from '../components/ui/primitives';

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
      <div className="grid min-h-svh place-items-center bg-ink mesh-bg-soft">
        <div className="text-center">
          <p className="eyebrow text-neon">Publicación</p>
          <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-paper">
            Cargando pieza…
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="grid min-h-svh place-items-center px-6 text-center mesh-bg-soft">
        <div>
          <Logo className="mb-8 justify-center" />
          <p className="eyebrow text-rosa">404</p>
          <p className="mt-4 font-display text-4xl font-extrabold tracking-[-0.04em] text-paper">
            Publicación no disponible
          </p>
          <p className="mx-auto mt-3 max-w-sm font-serif text-lg text-paper/60">
            {error || 'El enlace no es válido o está desactivado.'}
          </p>
          <div className="editorial-rule mx-auto mt-8 w-24" />
          <ButtonLink to="/" className="mt-8">
            Volver a <BrandName />
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-ink mesh-bg-soft">
      <header className="border-b border-white/8 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <Logo />
          <div className="min-w-0 text-right">
            <p className="eyebrow text-paper/40">Publicado</p>
            <p className="mt-1 truncate font-display text-base font-bold tracking-tight text-paper sm:text-lg">
              {project.title}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-muted">
              por {project.authorName || 'autor'}
            </p>
          </div>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-5xl px-6 py-12"
      >
        <PublicRenderer document={project.document} />
        <div className="mt-14 text-center">
          <div className="editorial-rule mx-auto mb-6 w-32" />
          <p className="eyebrow text-paper/35">
            Publicado con{' '}
            <Link to="/" className="text-neon no-underline hover:underline">
              <PliegoWordmark className="inline text-sm" variant="gradient" />
            </Link>
          </p>
        </div>
      </motion.main>
    </div>
  );
}

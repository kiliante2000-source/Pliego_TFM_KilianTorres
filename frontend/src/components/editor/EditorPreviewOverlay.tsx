import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, RotateCcw, X } from 'lucide-react';
import { PublicRenderer } from './PublicRenderer';
import { Button } from '../ui/primitives';
import type { DocumentModel } from '../../types/document';
import { cn } from '../../utils/cn';

export function EditorPreviewOverlay({
  document: doc,
  pageId,
  onClose,
}: {
  document: DocumentModel;
  pageId: string | null;
  onClose: () => void;
}) {
  const pages = useMemo(
    () => [...doc.pages].sort((a, b) => a.order - b.order),
    [doc.pages],
  );
  const [replayKey, setReplayKey] = useState(0);
  const [focusPageId, setFocusPageId] = useState(pageId ?? pages[0]?.id ?? null);
  const [mode, setMode] = useState<'story' | 'page'>('story');
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key.toLowerCase() === 'r') setReplayKey((k) => k + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const focusIndex = Math.max(
    0,
    pages.findIndex((p) => p.id === focusPageId),
  );

  const goTo = (id: string) => {
    setFocusPageId(id);
    requestAnimationFrame(() => {
      window.document
        .getElementById(`preview-page-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const goRelative = (delta: number) => {
    const next = pages[focusIndex + delta];
    if (next) goTo(next.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="eyebrow text-lima">Preview interactiva</p>
          <p className="mt-1 text-sm text-paper/75">
            Motion + CTAs entre páginas · R replay · Esc salir
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-white/12 bg-ink-2/80 p-0.5">
            <button
              type="button"
              onClick={() => setMode('story')}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                mode === 'story' ? 'bg-neon text-white' : 'text-paper/65 hover:text-paper',
              )}
            >
              Relato completo
            </button>
            <button
              type="button"
              onClick={() => setMode('page')}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                mode === 'page' ? 'bg-neon text-white' : 'text-paper/65 hover:text-paper',
              )}
            >
              Página actual
            </button>
          </div>
          <Button variant="soft" onClick={() => setReplayKey((k) => k + 1)}>
            <RotateCcw size={15} />
            Replay
          </Button>
          <Button variant="soft" onClick={onClose}>
            <X size={15} />
            Cerrar
          </Button>
        </div>
      </div>

      {mode === 'story' && pages.length > 1 ? (
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/8 px-4 py-2.5 scrollbar-thin">
          <button
            type="button"
            disabled={focusIndex <= 0}
            onClick={() => goRelative(-1)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-paper/70 transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          {pages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(p.id)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition',
                focusPageId === p.id
                  ? 'bg-lima/20 text-lima ring-1 ring-lima/40'
                  : 'bg-ink-2 text-paper/60 hover:text-paper',
              )}
            >
              {String(i + 1).padStart(2, '0')} · {p.name}
            </button>
          ))}
          <button
            type="button"
            disabled={focusIndex >= pages.length - 1}
            onClick={() => goRelative(1)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-paper/70 transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}

      <div ref={scrollerRef} className="relative flex-1 overflow-auto px-4 py-8 scrollbar-thin">
        <PublicRenderer
          document={doc}
          pageId={mode === 'page' ? focusPageId ?? pageId : null}
          replayKey={replayKey}
          fitWidth={Math.min(1100, window.innerWidth - 48)}
          className="mx-auto"
          scrollContainerRef={scrollerRef}
          onNavigate={(id) => {
            setMode('story');
            goTo(id);
            setReplayKey((k) => k + 1);
          }}
        />
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-ink/80 px-4 py-2 font-mono text-sm uppercase tracking-[0.14em] text-paper/70 backdrop-blur">
        <Play size={12} className="text-lima" />
        {mode === 'story'
          ? 'Pulsa CTAs · scroll · hover'
          : 'Vista de página · cambia a Relato para navegar'}
      </div>
    </div>
  );
}

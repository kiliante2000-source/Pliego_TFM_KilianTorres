import { useEffect, useRef } from 'react';
import type { CanvasElement, DocumentModel, Page } from '../../types/document';
import { sortElements } from '../../utils/document';
import { effectsCss, gradientCss } from '../../utils/elementStyle';

export type PreviewNavigate = (pageId: string) => void;

function resolveInteractionHref(
  href: string | undefined,
  pages: Page[],
  currentPageId: string,
  options?: { defaultNextForButton?: boolean },
): { kind: 'external' | 'page' | 'none'; value?: string } {
  const raw = (href ?? '').trim();
  const ordered = [...pages].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.id === currentPageId);

  if (!raw || raw === '#' || raw === 'pliego:next') {
    if (!raw && !options?.defaultNextForButton) return { kind: 'none' };
    const next = ordered[idx + 1];
    return next ? { kind: 'page', value: next.id } : { kind: 'none' };
  }
  if (raw === 'pliego:prev') {
    const prev = ordered[idx - 1];
    return prev ? { kind: 'page', value: prev.id } : { kind: 'none' };
  }
  if (raw.startsWith('pliego:page:')) {
    const id = raw.slice('pliego:page:'.length);
    const page = ordered.find((p) => p.id === id || p.name === id);
    return page ? { kind: 'page', value: page.id } : { kind: 'none' };
  }
  if (raw.startsWith('#page:')) {
    const key = raw.slice('#page:'.length);
    const page = ordered.find((p) => p.id === key || p.name === key);
    return page ? { kind: 'page', value: page.id } : { kind: 'none' };
  }
  if (/^https?:\/\//i.test(raw) || raw.startsWith('mailto:')) {
    return { kind: 'external', value: raw };
  }
  // Site-relative paths work in preview/public the same way as in PDF export
  if (raw.startsWith('/') && typeof window !== 'undefined') {
    const origin = window.location.origin.replace(/\/$/, '');
    return { kind: 'external', value: raw === '/' ? `${origin}/` : `${origin}${raw}` };
  }
  // bare page name / id
  const page = ordered.find((p) => p.id === raw || p.name === raw);
  if (page) return { kind: 'page', value: page.id };
  return { kind: 'none' };
}

function useRevealOnScroll(trigger: string | undefined, preset: string | undefined) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !preset || preset === 'none') return;
    if (trigger === 'load') {
      requestAnimationFrame(() => node.classList.add('is-in'));
      return;
    }
    if (trigger === 'hover') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [trigger, preset]);
  return ref;
}

function ElementView({
  el,
  pages,
  currentPageId,
  onNavigate,
}: {
  el: CanvasElement;
  pages: Page[];
  currentPageId: string;
  onNavigate?: PreviewNavigate;
}) {
  const preset = el.animation?.preset ?? 'none';
  const trigger = el.animation?.trigger ?? 'load';
  const ref = useRevealOnScroll(trigger, preset);
  const duration = el.animation?.duration ?? 700;
  const delay = el.animation?.delay ?? 0;
  const hasLinkIntent = Boolean(el.interaction?.href) || el.type === 'button';
  const resolved = hasLinkIntent
    ? resolveInteractionHref(el.interaction?.href, pages, currentPageId, {
        defaultNextForButton: el.type === 'button',
      })
    : el.type === 'video' && el.src && /^https?:\/\//i.test(el.src)
      ? { kind: 'external' as const, value: el.src }
      : { kind: 'none' as const };
  const interactive = resolved.kind !== 'none';

  const style: React.CSSProperties = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    transform: `rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY})`,
    opacity: el.opacity,
    transformOrigin: 'center center',
    ...effectsCss(el.effects),
    ['--pliego-dur' as string]: `${duration}ms`,
    ['--pliego-delay' as string]: `${delay}ms`,
    cursor: interactive ? 'pointer' : undefined,
    pointerEvents: interactive ? 'auto' : 'none',
    zIndex: interactive ? Math.max(el.zIndex, 50) : el.zIndex,
    transition:
      el.interaction?.hoverScale || el.interaction?.hoverOpacity || interactive
        ? 'transform 220ms ease, opacity 220ms ease, filter 220ms ease'
        : undefined,
  };

  const animClass =
    preset && preset !== 'none' ? `pliego-anim pliego-anim--${preset}` : undefined;

  const handleActivate = () => {
    if (resolved.kind === 'page' && resolved.value) {
      onNavigate?.(resolved.value);
      return;
    }
    if (resolved.kind === 'external' && resolved.value) {
      window.open(resolved.value, el.interaction?.target ?? '_blank', 'noopener,noreferrer');
    }
  };

  const wrap = (node: React.ReactNode) => {
    const inner = (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={animClass}
        style={style}
        onMouseEnter={(e) => {
          if (trigger === 'hover' && preset !== 'none') e.currentTarget.classList.add('is-in');
          const t = e.currentTarget;
          const scale = el.interaction?.hoverScale ?? (interactive ? 1.04 : undefined);
          if (scale) {
            t.style.transform = `rotate(${el.rotation}deg) scale(${scale})`;
          }
          if (el.interaction?.hoverOpacity != null) {
            t.style.opacity = String(el.interaction.hoverOpacity);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY})`;
          e.currentTarget.style.opacity = String(el.opacity);
        }}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          handleActivate();
        }}
        role={interactive ? 'link' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(e) => {
          if (!interactive) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleActivate();
          }
        }}
      >
        {node}
      </div>
    );
    return inner;
  };

  if (el.type === 'text') {
    return wrap(
      <div
        style={{
          width: '100%',
          height: '100%',
          fontSize: el.style.fontSize,
          fontFamily: el.style.fontFamily,
          fontWeight: el.style.fontWeight,
          fontStyle: el.style.italic ? 'italic' : undefined,
          textDecoration: el.style.underline ? 'underline' : undefined,
          color: el.style.color,
          textAlign: el.style.align,
          lineHeight: el.style.lineHeight ?? 1.3,
          letterSpacing: el.style.letterSpacing ?? 0,
          textTransform: el.style.textTransform ?? 'none',
          whiteSpace: 'pre-wrap',
        }}
      >
        {el.text}
      </div>,
    );
  }

  if (el.type === 'image') {
    return wrap(
      <img
        src={el.src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: el.fit ?? 'cover',
          borderRadius: el.cornerRadius ?? 0,
          display: 'block',
        }}
      />,
    );
  }

  if (el.type === 'button') {
    return wrap(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          background: el.fill,
          color: el.textColor,
          borderRadius: el.cornerRadius ?? 999,
          fontFamily: el.fontFamily ?? 'Space Grotesk',
          fontSize: el.fontSize ?? 16,
          fontWeight: el.fontWeight ?? 600,
          border: `${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        }}
      >
        {el.label}
      </div>,
    );
  }

  if (el.type === 'video') {
    return wrap(
      <video
        src={el.src}
        poster={el.poster}
        autoPlay={el.autoplay}
        loop={el.loop}
        muted={el.muted ?? true}
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: el.cornerRadius ?? 12,
          display: 'block',
          background: '#111',
        }}
      />,
    );
  }

  if (el.type === 'shape') {
    const isLiveOrb = el.shape === 'ellipse' && el.fillGradient?.type === 'radial';
    return wrap(
      <div
        className={isLiveOrb ? 'pliego-orb-live' : undefined}
        style={{
          width: '100%',
          height: '100%',
          background: isLiveOrb ? undefined : gradientCss(el.fillGradient, el.fill),
          borderRadius: el.shape === 'ellipse' ? '50%' : el.cornerRadius ?? 0,
          border: `${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'}`,
        }}
      />,
    );
  }

  return null;
}

export function PublicRenderer({
  document,
  pageId,
  replayKey = 0,
  fitWidth = 920,
  className,
  onNavigate,
}: {
  document: DocumentModel;
  /** Si se indica, solo renderiza esa página (modo página única). */
  pageId?: string | null;
  replayKey?: number;
  fitWidth?: number;
  className?: string;
  onNavigate?: PreviewNavigate;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}) {
  const allPages = [...document.pages].sort((a, b) => a.order - b.order);
  const pages = allPages.filter((p) => (pageId ? p.id === pageId : true));
  const scale = Math.min(1, fitWidth / document.meta.width);

  return (
    <div key={replayKey} className={className ?? 'space-y-14 py-4'}>
      {pages.map((page, index) => (
        <article
          key={`${page.id}-${replayKey}`}
          id={`preview-page-${page.id}`}
          data-page-id={page.id}
          className="public-page mx-auto overflow-hidden"
          style={{
            width: document.meta.width * scale,
            height: document.meta.height * scale,
            background: page.background.fill,
            position: 'relative',
            boxShadow: '0 40px 100px rgba(0,0,0,0.45)',
            scrollMarginTop: 24,
          }}
        >
          <div
            className="absolute left-3 top-3 z-10 rounded-full bg-black/45 px-2.5 py-1 font-mono text-sm uppercase tracking-widest text-white/85 backdrop-blur"
            style={{ transform: `scale(${1 / scale})`, transformOrigin: 'top left' }}
          >
            {page.name || `Página ${index + 1}`} · {String(index + 1).padStart(2, '0')}/
            {String(allPages.length).padStart(2, '0')}
          </div>
          <div
            style={{
              width: document.meta.width,
              height: document.meta.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'relative',
            }}
          >
            {sortElements(page.elements).map((el) => (
              <ElementView
                key={`${el.id}-${replayKey}`}
                el={el}
                pages={allPages}
                currentPageId={page.id}
                onNavigate={(targetId) => {
                  onNavigate?.(targetId);
                  window.document
                    .getElementById(`preview-page-${targetId}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

import { useEffect, useRef } from 'react';
import type { CanvasElement, DocumentModel } from '../../types/document';
import { sortElements } from '../../utils/document';
import { effectsCss, gradientCss } from '../../utils/elementStyle';

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
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [trigger, preset]);
  return ref;
}

function ElementView({ el }: { el: CanvasElement }) {
  const preset = el.animation?.preset ?? 'none';
  const trigger = el.animation?.trigger ?? 'load';
  const ref = useRevealOnScroll(trigger, preset);
  const duration = el.animation?.duration ?? 700;
  const delay = el.animation?.delay ?? 0;

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
    cursor: el.interaction?.href ? 'pointer' : undefined,
    transition:
      el.interaction?.hoverScale || el.interaction?.hoverOpacity
        ? 'transform 220ms ease, opacity 220ms ease'
        : undefined,
  };

  const animClass =
    preset && preset !== 'none' ? `pliego-anim pliego-anim--${preset}` : undefined;

  const wrap = (node: React.ReactNode) => {
    const inner = (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={animClass}
        style={style}
        onMouseEnter={(e) => {
          if (trigger === 'hover' && preset !== 'none') e.currentTarget.classList.add('is-in');
          const t = e.currentTarget;
          if (el.interaction?.hoverScale) {
            t.style.transform = `rotate(${el.rotation}deg) scale(${el.interaction.hoverScale})`;
          }
          if (el.interaction?.hoverOpacity != null) {
            t.style.opacity = String(el.interaction.hoverOpacity);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY})`;
          e.currentTarget.style.opacity = String(el.opacity);
        }}
        onClick={() => {
          if (!el.interaction?.href) return;
          window.open(el.interaction.href, el.interaction.target ?? '_blank', 'noopener,noreferrer');
        }}
        role={el.interaction?.href ? 'link' : undefined}
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
    const isLiveOrb =
      el.shape === 'ellipse' && el.fillGradient?.type === 'radial';
    return wrap(
      <div
        className={isLiveOrb ? 'pliego-orb-live' : undefined}
        style={{
          width: '100%',
          height: '100%',
          background: isLiveOrb
            ? undefined
            : gradientCss(el.fillGradient, el.fill),
          borderRadius: el.shape === 'ellipse' ? '50%' : el.cornerRadius ?? 0,
          border: `${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'}`,
        }}
      />,
    );
  }

  return null;
}

export function PublicRenderer({ document }: { document: DocumentModel }) {
  const pages = [...document.pages].sort((a, b) => a.order - b.order);
  const scale = Math.min(1, 920 / document.meta.width);

  return (
    <div className="space-y-12 py-4">
      {pages.map((page, index) => (
        <article
          key={page.id}
          className="public-page mx-auto overflow-hidden"
          style={{
            width: document.meta.width * scale,
            height: document.meta.height * scale,
            background: page.background.fill,
            position: 'relative',
            boxShadow: '0 40px 100px rgba(0,0,0,0.45)',
          }}
        >
          {pages.length > 1 ? (
            <div
              className="absolute left-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 font-mono text-xs uppercase tracking-widest text-white/80 backdrop-blur"
              style={{ transform: `scale(${1 / scale})`, transformOrigin: 'top left' }}
            >
              {String(index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
            </div>
          ) : null}
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
              <ElementView key={el.id} el={el} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

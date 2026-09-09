import { useEffect, useRef, useState } from 'react';
import type { CanvasElement, DocumentModel, Project } from '../../types/document';
import { sortElements } from '../../utils/document';
import { effectsCss, gradientCss } from '../../utils/elementStyle';

const TEMPLATE_LABELS: Record<string, string> = {
  'manifesto-digital': 'Manifesto digital',
  'portfolio-kinetic': 'Portfolio kinetic',
  'portada-editorial': 'Portada editorial',
  'revista-doble': 'Página de revista',
  'catalogo-producto': 'Catálogo / lookbook',
  'presentacion-slide': 'Presentación slide',
};

const SIZE_HINTS: { w: number; h: number; label: string }[] = [
  { w: 1440, h: 900, label: 'Manifesto digital' },
  { w: 1080, h: 1350, label: 'Formato vertical' },
  { w: 1200, h: 1600, label: 'Página de revista' },
  { w: 1920, h: 1080, label: 'Presentación slide' },
];

export function projectKindLabel(project: Project): string {
  const meta = project.document?.meta;
  if (meta?.templateName) return meta.templateName;
  if (meta?.templateId && TEMPLATE_LABELS[meta.templateId]) {
    return TEMPLATE_LABELS[meta.templateId];
  }
  const hit = SIZE_HINTS.find((s) => s.w === project.width && s.h === project.height);
  if (hit) return hit.label;
  if (project.orientation === 'landscape') return 'Lienzo horizontal';
  return 'Lienzo en blanco';
}

function ThumbElement({ el }: { el: CanvasElement }) {
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
    pointerEvents: 'none',
  };

  if (el.type === 'text') {
    return (
      <div
        style={{
          ...style,
          fontSize: el.style.fontSize,
          fontFamily: el.style.fontFamily,
          fontWeight: el.style.fontWeight,
          fontStyle: el.style.italic ? 'italic' : undefined,
          textDecoration: el.style.underline ? 'underline' : undefined,
          color: el.style.color,
          textAlign: el.style.align,
          lineHeight: el.style.lineHeight ?? 1.2,
          letterSpacing: el.style.letterSpacing ?? 0,
          textTransform: el.style.textTransform ?? 'none',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
        }}
      >
        {el.text}
      </div>
    );
  }

  if (el.type === 'image') {
    return (
      <img
        src={el.src}
        alt=""
        draggable={false}
        style={{
          ...style,
          objectFit: el.fit ?? 'cover',
          borderRadius: el.cornerRadius ?? 0,
        }}
      />
    );
  }

  if (el.type === 'button') {
    return (
      <div
        style={{
          ...style,
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
      </div>
    );
  }

  if (el.type === 'video') {
    return (
      <div
        style={{
          ...style,
          borderRadius: el.cornerRadius ?? 12,
          background: el.poster
            ? `center / cover no-repeat url(${el.poster}), #111`
            : '#111',
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 18,
        }}
      >
        ▶
      </div>
    );
  }

  if (el.type === 'shape') {
    return (
      <div
        style={{
          ...style,
          background: gradientCss(el.fillGradient, el.fill),
          borderRadius: el.shape === 'ellipse' ? '50%' : el.cornerRadius ?? 0,
          border: `${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'}`,
        }}
      />
    );
  }

  return null;
}

/** Cover con previsualización real de la primera página del proyecto. */
export function ProjectCover({ project }: { project: Project }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);

  const doc = project.document as DocumentModel | undefined;
  const page = doc?.pages
    ? [...doc.pages].sort((a, b) => a.order - b.order)[0]
    : undefined;
  const width = doc?.meta?.width || project.width || 1080;
  const height = doc?.meta?.height || project.height || 1350;
  const bg = page?.background?.fill || '#0B0E11';

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const apply = () => {
      const next = Math.min(node.clientWidth / width, node.clientHeight / height);
      setScale(Number.isFinite(next) && next > 0 ? next : 0.15);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(node);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
      {page ? (
        <div
          className="absolute left-0 top-0"
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {sortElements(page.elements).map((el) => (
            <ThumbElement key={el.id} el={el} />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink-3 to-ink" />
      )}
    </div>
  );
}

import type { DocumentModel, CanvasElement } from '../../types/document';
import { sortElements } from '../../utils/document';

function ElementView({ el }: { el: CanvasElement }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    transform: `rotate(${el.rotation}deg) scale(${el.scaleX}, ${el.scaleY})`,
    opacity: el.opacity,
    transformOrigin: 'center center',
  };

  if (el.type === 'text') {
    return (
      <div
        style={{
          ...style,
          fontSize: el.style.fontSize,
          fontFamily: el.style.fontFamily,
          fontWeight: el.style.fontWeight,
          color: el.style.color,
          textAlign: el.style.align,
          lineHeight: el.style.lineHeight ?? 1.3,
          letterSpacing: el.style.letterSpacing ?? 0,
          whiteSpace: 'pre-wrap',
        }}
      >
        {el.text}
      </div>
    );
  }

  if (el.type === 'image') {
    return <img src={el.src} alt="" style={{ ...style, objectFit: el.fit ?? 'cover' }} />;
  }

  if (el.type === 'shape') {
    return (
      <div
        style={{
          ...style,
          background: el.fill,
          borderRadius: el.shape === 'ellipse' ? '50%' : el.cornerRadius ?? 0,
          border: `${el.strokeWidth ?? 0}px solid ${el.stroke ?? 'transparent'}`,
        }}
      />
    );
  }

  return null;
}

export function PublicRenderer({ document }: { document: DocumentModel }) {
  const pages = [...document.pages].sort((a, b) => a.order - b.order);
  const scale = Math.min(1, 860 / document.meta.width);

  return (
    <div className="space-y-10">
      {pages.map((page) => (
        <article
          key={page.id}
          className="mx-auto overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          style={{
            width: document.meta.width * scale,
            height: document.meta.height * scale,
            background: page.background.fill,
            position: 'relative',
          }}
        >
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

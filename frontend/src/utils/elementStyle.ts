import type {
  CanvasElement,
  ElementEffects,
  FillGradient,
} from '../types/document';

export function gradientCss(g?: FillGradient, fallback = 'transparent'): string {
  if (!g?.stops?.length) return fallback;
  const stops = g.stops
    .map((s) => `${s.color} ${Math.round(s.offset * 100)}%`)
    .join(', ');
  if (g.type === 'radial') return `radial-gradient(circle at 50% 40%, ${stops})`;
  return `linear-gradient(${g.angle ?? 135}deg, ${stops})`;
}

export function effectsCss(effects?: ElementEffects): React.CSSProperties {
  if (!effects) return {};
  const shadowOpacity = effects.shadowOpacity ?? 0.45;
  const shadowColor = effects.shadowColor ?? '#000000';
  const rgba =
    shadowColor.startsWith('#') && shadowColor.length === 7
      ? hexToRgba(shadowColor, shadowOpacity)
      : shadowColor;
  return {
    filter: effects.blur ? `blur(${effects.blur}px)` : undefined,
    boxShadow:
      effects.shadowBlur || effects.shadowOffsetX || effects.shadowOffsetY
        ? `${effects.shadowOffsetX ?? 0}px ${effects.shadowOffsetY ?? 12}px ${effects.shadowBlur ?? 32}px ${rgba}`
        : undefined,
    mixBlendMode: (effects.blendMode && effects.blendMode !== 'normal'
      ? effects.blendMode
      : undefined) as React.CSSProperties['mixBlendMode'],
  };
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function elementLabel(el: CanvasElement): string {
  if (el.name) return el.name;
  switch (el.type) {
    case 'text':
      return el.text.slice(0, 28) || 'Texto';
    case 'button':
      return el.label || 'Botón';
    case 'video':
      return 'Vídeo';
    case 'image':
      return 'Imagen';
    case 'shape':
      return el.shape === 'ellipse' ? 'Elipse' : 'Forma';
    default:
      return 'Elemento';
  }
}

export function konvaShadow(effects?: ElementEffects) {
  if (!effects) return {};
  return {
    shadowColor: effects.shadowColor ?? '#000000',
    shadowBlur: effects.shadowBlur ?? 0,
    shadowOffsetX: effects.shadowOffsetX ?? 0,
    shadowOffsetY: effects.shadowOffsetY ?? 0,
    shadowOpacity: effects.shadowOpacity ?? 0.4,
    shadowEnabled: Boolean(
      effects.shadowBlur || effects.shadowOffsetX || effects.shadowOffsetY,
    ),
  };
}

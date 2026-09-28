import Konva from 'konva';
import type {
  CanvasElement,
  ElementEffects,
  FillGradient,
  ImageElement,
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
  const hasShadow = Boolean(
    (effects.shadowBlur && effects.shadowBlur > 0) ||
      effects.shadowOffsetX ||
      effects.shadowOffsetY,
  );
  return {
    filter: effects.blur ? `blur(${effects.blur}px)` : undefined,
    boxShadow: hasShadow
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

const BLEND_MAP: Record<string, GlobalCompositeOperation> = {
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  difference: 'difference',
  'soft-light': 'soft-light',
};

/** Props Konva for shadow + blend. Blur uses Filters + cache (see useKonvaNodeEffects). */
export function konvaEffectsProps(effects?: ElementEffects) {
  if (!effects) {
    return {
      shadowEnabled: false,
      filters: undefined as Konva.Filter[] | undefined,
      blurRadius: 0,
      globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
    };
  }

  const blur = Math.max(0, effects.blur ?? 0);
  const shadowBlur = effects.shadowBlur ?? 0;
  const shadowOffsetX = effects.shadowOffsetX ?? 0;
  const shadowOffsetY = effects.shadowOffsetY ?? 0;
  const shadowEnabled = Boolean(shadowBlur > 0 || shadowOffsetX || shadowOffsetY);

  return {
    shadowColor: effects.shadowColor ?? '#000000',
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowOpacity: effects.shadowOpacity ?? 0.45,
    shadowEnabled,
    filters: blur > 0 ? [Konva.Filters.Blur] : undefined,
    blurRadius: blur,
    globalCompositeOperation: (effects.blendMode && BLEND_MAP[effects.blendMode]
      ? BLEND_MAP[effects.blendMode]
      : 'source-over') as GlobalCompositeOperation,
  };
}

/** @deprecated use konvaEffectsProps */
export function konvaShadow(effects?: ElementEffects) {
  const p = konvaEffectsProps(effects);
  return {
    shadowColor: p.shadowColor,
    shadowBlur: p.shadowBlur,
    shadowOffsetX: p.shadowOffsetX,
    shadowOffsetY: p.shadowOffsetY,
    shadowOpacity: p.shadowOpacity,
    shadowEnabled: p.shadowEnabled,
  };
}

/** Crop window for Konva Image cover/contain. Fill = stretch (no crop). */
export function imageCropForFit(
  img: HTMLImageElement,
  boxW: number,
  boxH: number,
  fit: ImageElement['fit'] = 'cover',
): { crop?: { x: number; y: number; width: number; height: number }; width: number; height: number; offsetX: number; offsetY: number } {
  if (fit === 'fill' || !img.width || !img.height) {
    return { width: boxW, height: boxH, offsetX: 0, offsetY: 0 };
  }

  const imgRatio = img.width / img.height;
  const boxRatio = boxW / boxH;

  if (fit === 'cover') {
    if (imgRatio > boxRatio) {
      const h = img.height;
      const w = h * boxRatio;
      return {
        crop: { x: (img.width - w) / 2, y: 0, width: w, height: h },
        width: boxW,
        height: boxH,
        offsetX: 0,
        offsetY: 0,
      };
    }
    const w = img.width;
    const h = w / boxRatio;
    return {
      crop: { x: 0, y: (img.height - h) / 2, width: w, height: h },
      width: boxW,
      height: boxH,
      offsetX: 0,
      offsetY: 0,
    };
  }

  // contain — fit inside box, letterbox
  if (imgRatio > boxRatio) {
    const width = boxW;
    const height = boxW / imgRatio;
    return {
      width,
      height,
      offsetX: 0,
      offsetY: (boxH - height) / 2,
    };
  }
  const height = boxH;
  const width = boxH * imgRatio;
  return {
    width,
    height,
    offsetX: (boxW - width) / 2,
    offsetY: 0,
  };
}

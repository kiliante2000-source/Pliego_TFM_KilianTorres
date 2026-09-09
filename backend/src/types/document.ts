export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'difference'
  | 'soft-light';

export type ElementEffects = {
  blur?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  blendMode?: BlendMode;
};

export type AnimationPreset =
  | 'none'
  | 'fadeIn'
  | 'fadeUp'
  | 'fadeDown'
  | 'scaleIn'
  | 'slideLeft'
  | 'slideRight'
  | 'blurIn';

export type ElementAnimation = {
  preset: AnimationPreset;
  duration?: number;
  delay?: number;
  easing?: 'ease' | 'ease-out' | 'ease-in-out' | 'spring';
  trigger?: 'load' | 'scroll' | 'hover';
};

export type ElementInteraction = {
  href?: string;
  target?: '_self' | '_blank';
  hoverOpacity?: number;
  hoverScale?: number;
};

export type FillGradient = {
  type: 'linear' | 'radial';
  angle?: number;
  stops: { offset: number; color: string }[];
};

export type ElementBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  zIndex: number;
  locked?: boolean;
  name?: string;
  effects?: ElementEffects;
  animation?: ElementAnimation;
  interaction?: ElementInteraction;
};

export type TextElement = ElementBase & {
  type: 'text';
  text: string;
  style: {
    fontSize: number;
    fontFamily: string;
    fontWeight: number | string;
    color: string;
    align: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    italic?: boolean;
    underline?: boolean;
  };
};

export type ImageElement = ElementBase & {
  type: 'image';
  src: string;
  fit?: 'cover' | 'contain' | 'fill';
  cornerRadius?: number;
};

export type ShapeElement = ElementBase & {
  type: 'shape';
  shape: 'rect' | 'ellipse' | 'line';
  fill: string;
  fillGradient?: FillGradient;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
};

export type ButtonElement = ElementBase & {
  type: 'button';
  label: string;
  fill: string;
  textColor: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  cornerRadius?: number;
  stroke?: string;
  strokeWidth?: number;
};

export type VideoElement = ElementBase & {
  type: 'video';
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  cornerRadius?: number;
};

export type BackgroundElement = {
  type: 'background';
  fill: string;
  imageSrc?: string;
};

export type CanvasElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | ButtonElement
  | VideoElement;

export type Page = {
  id: string;
  name: string;
  order: number;
  background: BackgroundElement;
  elements: CanvasElement[];
};

export type DocumentModel = {
  version: 1;
  pages: Page[];
  meta: {
    title: string;
    width: number;
    height: number;
    templateId?: string;
    templateName?: string;
  };
};

export function createEmptyDocument(
  title: string,
  width: number,
  height: number,
  extras?: { templateId?: string; templateName?: string },
): DocumentModel {
  return {
    version: 1,
    meta: {
      title,
      width,
      height,
      ...(extras?.templateId ? { templateId: extras.templateId } : {}),
      ...(extras?.templateName ? { templateName: extras.templateName } : {}),
    },
    pages: [
      {
        id: crypto.randomUUID(),
        name: 'Página 1',
        order: 0,
        background: { type: 'background', fill: '#ffffff' },
        elements: [],
      },
    ],
  };
}

export function isDocumentModel(value: unknown): value is DocumentModel {
  if (!value || typeof value !== 'object') return false;
  const doc = value as DocumentModel;
  return doc.version === 1 && Array.isArray(doc.pages) && !!doc.meta;
}

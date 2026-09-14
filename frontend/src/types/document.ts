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

/** CTA / hotspot — published as interactive link */
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

/** Video / embed frame for digital editorial */
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
    /** Plantilla de origen, si aplica */
    templateId?: string;
    templateName?: string;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type Project = {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  width: number;
  height: number;
  orientation: string;
  status: string;
  visibility: string;
  published: boolean;
  document: DocumentModel;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
};

export type TemplateInfo = {
  id: string;
  name: string;
  category: string;
  description: string;
  width: number;
  height: number;
  orientation: string;
};

export type ProjectVersion = {
  id: string;
  versionNumber: number;
  label: string | null;
  createdAt: string;
  user?: { id: string; name: string };
};

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const FONT_OPTIONS = [
  'Space Grotesk',
  'JetBrains Mono',
  'Playfair Display',
  'Instrument Serif',
  'Syne',
  'DM Sans',
  'Georgia',
  'Arial',
] as const;

export const ANIMATION_PRESETS: { id: AnimationPreset; label: string }[] = [
  { id: 'none', label: 'Ninguna' },
  { id: 'fadeIn', label: 'Fade in' },
  { id: 'fadeUp', label: 'Fade up' },
  { id: 'fadeDown', label: 'Fade down' },
  { id: 'scaleIn', label: 'Scale in' },
  { id: 'slideLeft', label: 'Slide left' },
  { id: 'slideRight', label: 'Slide right' },
  { id: 'blurIn', label: 'Blur in' },
];

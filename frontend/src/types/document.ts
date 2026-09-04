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
};

export type TextElement = ElementBase & {
  type: 'text';
  text: string;
  style: {
    fontSize: number;
    fontFamily: string;
    fontWeight: number | string;
    color: string;
    align: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
  };
};

export type ImageElement = ElementBase & {
  type: 'image';
  src: string;
  fit?: 'cover' | 'contain' | 'fill';
};

export type ShapeElement = ElementBase & {
  type: 'shape';
  shape: 'rect' | 'ellipse' | 'line';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
};

export type BackgroundElement = {
  type: 'background';
  fill: string;
  imageSrc?: string;
};

export type CanvasElement = TextElement | ImageElement | ShapeElement;

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

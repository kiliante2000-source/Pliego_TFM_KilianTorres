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

export function createEmptyDocument(
  title: string,
  width: number,
  height: number,
): DocumentModel {
  return {
    version: 1,
    meta: { title, width, height },
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

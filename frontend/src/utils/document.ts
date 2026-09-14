import type { DocumentModel, CanvasElement, Page } from '../types/document';

export function createId() {
  return crypto.randomUUID();
}

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
        id: createId(),
        name: 'Página 1',
        order: 0,
        background: { type: 'background', fill: '#ffffff' },
        elements: [],
      },
    ],
  };
}

export function cloneDocument(doc: DocumentModel): DocumentModel {
  return structuredClone(doc);
}

export function getActivePage(doc: DocumentModel, pageId: string | null): Page | undefined {
  if (!pageId) return doc.pages[0];
  return doc.pages.find((p) => p.id === pageId) ?? doc.pages[0];
}

export function sortElements(elements: CanvasElement[]) {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}

export function nextZIndex(elements: CanvasElement[]) {
  return elements.reduce((max, el) => Math.max(max, el.zIndex), -1) + 1;
}

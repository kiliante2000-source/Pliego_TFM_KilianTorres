import { create } from 'zustand';
import type {
  CanvasElement,
  DocumentModel,
  Page,
  Project,
  SaveStatus,
  ShapeElement,
  TextElement,
} from '../types/document';
import { cloneDocument, createId, getActivePage, nextZIndex } from '../utils/document';
import { api } from '../services/api';

const HISTORY_LIMIT = 50;

type EditorState = {
  project: Project | null;
  document: DocumentModel | null;
  activePageId: string | null;
  selectedIds: string[];
  zoom: number;
  tool: 'select' | 'text' | 'rect' | 'ellipse' | 'image';
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  dirty: boolean;
  past: DocumentModel[];
  future: DocumentModel[];
  clipboard: CanvasElement[];

  loadProject: (projectId: string) => Promise<void>;
  setTool: (tool: EditorState['tool']) => void;
  setZoom: (zoom: number) => void;
  select: (ids: string[]) => void;
  setActivePage: (pageId: string) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  updateDocument: (updater: (doc: DocumentModel) => DocumentModel, recordHistory?: boolean) => void;
  updateSelected: (patch: Partial<CanvasElement> | ((el: CanvasElement) => CanvasElement)) => void;
  addText: () => void;
  addShape: (shape: 'rect' | 'ellipse') => void;
  addImage: (src: string) => void;
  deleteSelected: () => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  addPage: () => void;
  duplicatePage: (pageId: string) => void;
  deletePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setBackground: (fill: string) => void;
  saveNow: () => Promise<void>;
  markDirtyAndScheduleSave: () => void;
  reset: () => void;
};

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function withPage(
  doc: DocumentModel,
  pageId: string | null,
  fn: (page: Page, index: number) => Page,
): DocumentModel {
  const page = getActivePage(doc, pageId);
  if (!page) return doc;
  return {
    ...doc,
    pages: doc.pages.map((p, i) => (p.id === page.id ? fn(p, i) : p)),
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  document: null,
  activePageId: null,
  selectedIds: [],
  zoom: 0.55,
  tool: 'select',
  saveStatus: 'idle',
  lastSavedAt: null,
  dirty: false,
  past: [],
  future: [],
  clipboard: [],

  reset: () => {
    if (saveTimer) clearTimeout(saveTimer);
    set({
      project: null,
      document: null,
      activePageId: null,
      selectedIds: [],
      zoom: 0.55,
      tool: 'select',
      saveStatus: 'idle',
      lastSavedAt: null,
      dirty: false,
      past: [],
      future: [],
      clipboard: [],
    });
  },

  loadProject: async (projectId) => {
    const data = await api.get<{ project: Project }>(`/api/projects/${projectId}`);
    set({
      project: data.project,
      document: data.project.document,
      activePageId: data.project.document.pages[0]?.id ?? null,
      selectedIds: [],
      past: [],
      future: [],
      dirty: false,
      saveStatus: 'saved',
    });
  },

  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.min(2.5, Math.max(0.15, zoom)) }),
  select: (ids) => set({ selectedIds: ids }),
  setActivePage: (pageId) => set({ activePageId: pageId, selectedIds: [] }),

  pushHistory: () => {
    const { document, past } = get();
    if (!document) return;
    set({
      past: [...past, cloneDocument(document)].slice(-HISTORY_LIMIT),
      future: [],
    });
  },

  undo: () => {
    const { past, document, future } = get();
    if (!document || past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      document: previous,
      past: past.slice(0, -1),
      future: [cloneDocument(document), ...future].slice(0, HISTORY_LIMIT),
      dirty: true,
    });
    get().markDirtyAndScheduleSave();
  },

  redo: () => {
    const { future, document, past } = get();
    if (!document || future.length === 0) return;
    const next = future[0];
    set({
      document: next,
      future: future.slice(1),
      past: [...past, cloneDocument(document)].slice(-HISTORY_LIMIT),
      dirty: true,
    });
    get().markDirtyAndScheduleSave();
  },

  updateDocument: (updater, recordHistory = true) => {
    const { document } = get();
    if (!document) return;
    if (recordHistory) get().pushHistory();
    set({ document: updater(document), dirty: true });
    get().markDirtyAndScheduleSave();
  },

  updateSelected: (patch) => {
    const { selectedIds, activePageId } = get();
    if (selectedIds.length === 0) return;
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => ({
        ...page,
        elements: page.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          if (typeof patch === 'function') return patch(el);
          return { ...el, ...patch } as CanvasElement;
        }),
      })),
    );
  },

  addText: () => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const el: TextElement = {
          id: createId(),
          type: 'text',
          x: 80,
          y: 120,
          width: 420,
          height: 80,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          zIndex: nextZIndex(page.elements),
          text: 'Escribe aquí',
          style: {
            fontSize: 36,
            fontFamily: 'Fraunces',
            fontWeight: 600,
            color: '#111111',
            align: 'left',
            lineHeight: 1.2,
          },
        };
        set({ selectedIds: [el.id], tool: 'select' });
        return { ...page, elements: [...page.elements, el] };
      }),
    );
  },

  addShape: (shape) => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const el: ShapeElement = {
          id: createId(),
          type: 'shape',
          shape,
          x: 140,
          y: 180,
          width: 240,
          height: 160,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          zIndex: nextZIndex(page.elements),
          fill: shape === 'rect' ? '#4F80FF' : '#A855F7',
          cornerRadius: shape === 'rect' ? 0 : undefined,
        };
        set({ selectedIds: [el.id], tool: 'select' });
        return { ...page, elements: [...page.elements, el] };
      }),
    );
  },

  addImage: (src) => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const el: CanvasElement = {
          id: createId(),
          type: 'image',
          src,
          x: 100,
          y: 140,
          width: 360,
          height: 240,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          zIndex: nextZIndex(page.elements),
          fit: 'cover',
        };
        set({ selectedIds: [el.id], tool: 'select' });
        return { ...page, elements: [...page.elements, el] };
      }),
    );
  },

  deleteSelected: () => {
    const { selectedIds, activePageId } = get();
    if (!selectedIds.length) return;
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => ({
        ...page,
        elements: page.elements.filter((el) => !selectedIds.includes(el.id)),
      })),
    );
    set({ selectedIds: [] });
  },

  copySelected: () => {
    const { document, activePageId, selectedIds } = get();
    if (!document) return;
    const page = getActivePage(document, activePageId);
    if (!page) return;
    set({
      clipboard: page.elements
        .filter((el) => selectedIds.includes(el.id))
        .map((el) => structuredClone(el)),
    });
  },

  pasteClipboard: () => {
    const { clipboard, activePageId } = get();
    if (!clipboard.length) return;
    const newIds: string[] = [];
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const pasted = clipboard.map((el, i) => {
          const id = createId();
          newIds.push(id);
          return {
            ...structuredClone(el),
            id,
            x: el.x + 24,
            y: el.y + 24,
            zIndex: nextZIndex(page.elements) + i,
          };
        });
        return { ...page, elements: [...page.elements, ...pasted] };
      }),
    );
    set({ selectedIds: newIds });
  },

  bringForward: () => {
    const { selectedIds, activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => ({
        ...page,
        elements: page.elements.map((el) =>
          selectedIds.includes(el.id) ? { ...el, zIndex: el.zIndex + 1 } : el,
        ),
      })),
    );
  },

  sendBackward: () => {
    const { selectedIds, activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => ({
        ...page,
        elements: page.elements.map((el) =>
          selectedIds.includes(el.id) ? { ...el, zIndex: Math.max(0, el.zIndex - 1) } : el,
        ),
      })),
    );
  },

  addPage: () => {
    get().updateDocument((doc) => {
      const page: Page = {
        id: createId(),
        name: `Página ${doc.pages.length + 1}`,
        order: doc.pages.length,
        background: { type: 'background', fill: '#ffffff' },
        elements: [],
      };
      set({ activePageId: page.id, selectedIds: [] });
      return { ...doc, pages: [...doc.pages, page] };
    });
  },

  duplicatePage: (pageId) => {
    get().updateDocument((doc) => {
      const source = doc.pages.find((p) => p.id === pageId);
      if (!source) return doc;
      const copy: Page = {
        ...structuredClone(source),
        id: createId(),
        name: `${source.name} copia`,
        order: doc.pages.length,
        elements: source.elements.map((el) => ({ ...structuredClone(el), id: createId() })),
      };
      set({ activePageId: copy.id });
      return { ...doc, pages: [...doc.pages, copy] };
    });
  },

  deletePage: (pageId) => {
    get().updateDocument((doc) => {
      if (doc.pages.length <= 1) return doc;
      const pages = doc.pages
        .filter((p) => p.id !== pageId)
        .map((p, i) => ({ ...p, order: i }));
      set({ activePageId: pages[0]?.id ?? null, selectedIds: [] });
      return { ...doc, pages };
    });
  },

  reorderPages: (fromIndex, toIndex) => {
    get().updateDocument((doc) => {
      const pages = [...doc.pages].sort((a, b) => a.order - b.order);
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      return {
        ...doc,
        pages: pages.map((p, i) => ({ ...p, order: i })),
      };
    });
  },

  setBackground: (fill) => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => ({
        ...page,
        background: { ...page.background, fill },
      })),
    );
  },

  markDirtyAndScheduleSave: () => {
    set({ dirty: true, saveStatus: 'idle' });
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      void get().saveNow();
    }, 800);
  },

  saveNow: async () => {
    const { project, document, dirty } = get();
    if (!project || !document || !dirty) return;
    set({ saveStatus: 'saving' });
    try {
      const data = await api.patch<{ project: Project; savedAt: string }>(
        `/api/projects/${project.id}/document`,
        { document },
      );
      set({
        project: data.project,
        saveStatus: 'saved',
        lastSavedAt: data.savedAt,
        dirty: false,
      });
    } catch {
      set({ saveStatus: 'error' });
    }
  },
}));

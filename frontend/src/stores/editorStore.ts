import { create } from 'zustand';
import type {
  ButtonElement,
  CanvasElement,
  DocumentModel,
  Page,
  Project,
  SaveStatus,
  ShapeElement,
  TextElement,
  VideoElement,
} from '../types/document';
import { cloneDocument, createId, getActivePage, nextZIndex } from '../utils/document';
import { api } from '../services/api';

const HISTORY_LIMIT = 50;

export type AlignMode =
  | 'left'
  | 'centerX'
  | 'right'
  | 'top'
  | 'centerY'
  | 'bottom'
  | 'distributeX'
  | 'distributeY';

type EditorState = {
  project: Project | null;
  document: DocumentModel | null;
  activePageId: string | null;
  selectedIds: string[];
  zoom: number;
  tool: 'select' | 'text' | 'rect' | 'ellipse' | 'image' | 'button' | 'video';
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
  addText: (preset?: 'display' | 'headline' | 'body' | 'caption' | 'quote') => void;
  addShape: (shape: 'rect' | 'ellipse', withGradient?: boolean) => void;
  addImage: (src: string) => void;
  addButton: () => void;
  addVideo: (src?: string) => void;
  deleteSelected: () => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  alignSelected: (mode: AlignMode) => void;
  toggleLockSelected: () => void;
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

function baseTransform(zIndex: number) {
  return {
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex,
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

  addText: (preset = 'headline') => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const presets = {
          display: {
            text: 'TÍTULO\nIMPACTO',
            width: 720,
            height: 220,
            style: {
              fontSize: 96,
              fontFamily: 'Syne',
              fontWeight: 700,
              color: '#F4F6F8',
              align: 'left' as const,
              lineHeight: 0.95,
              letterSpacing: -3,
              textTransform: 'uppercase' as const,
            },
            animation: { preset: 'fadeUp' as const, duration: 900, trigger: 'scroll' as const },
          },
          headline: {
            text: 'Escribe el titular',
            width: 520,
            height: 90,
            style: {
              fontSize: 42,
              fontFamily: 'Space Grotesk',
              fontWeight: 600,
              color: '#111111',
              align: 'left' as const,
              lineHeight: 1.1,
              letterSpacing: -1,
            },
            animation: { preset: 'fadeIn' as const, duration: 700, trigger: 'load' as const },
          },
          body: {
            text: 'Cuerpo editorial. Usa este bloque para narrativa, reportaje o pie de foto extendido. El ritmo tipográfico define la lectura digital.',
            width: 420,
            height: 180,
            style: {
              fontSize: 18,
              fontFamily: 'DM Sans',
              fontWeight: 400,
              color: '#2A2F36',
              align: 'left' as const,
              lineHeight: 1.55,
              letterSpacing: 0,
            },
          },
          caption: {
            text: 'PIE · VOL. 01',
            width: 280,
            height: 36,
            style: {
              fontSize: 12,
              fontFamily: 'JetBrains Mono',
              fontWeight: 500,
              color: '#8B95A3',
              align: 'left' as const,
              letterSpacing: 3,
              textTransform: 'uppercase' as const,
            },
          },
          quote: {
            text: '“La página digital es un escenario, no un contenedor.”',
            width: 480,
            height: 140,
            style: {
              fontSize: 32,
              fontFamily: 'Instrument Serif',
              fontWeight: 400,
              color: '#111111',
              align: 'left' as const,
              lineHeight: 1.25,
              italic: true,
            },
            animation: { preset: 'blurIn' as const, duration: 1000, trigger: 'scroll' as const },
          },
        };
        const p = presets[preset];
        const el: TextElement = {
          id: createId(),
          type: 'text',
          x: 80,
          y: 120,
          ...baseTransform(nextZIndex(page.elements)),
          width: p.width,
          height: p.height,
          text: p.text,
          style: p.style,
          animation: 'animation' in p ? p.animation : undefined,
          name: preset,
        };
        set({ selectedIds: [el.id], tool: 'select' });
        return { ...page, elements: [...page.elements, el] };
      }),
    );
  },

  addShape: (shape, withGradient = false) => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const el: ShapeElement = {
          id: createId(),
          type: 'shape',
          shape,
          x: 140,
          y: 180,
          width: shape === 'ellipse' ? 280 : 320,
          height: shape === 'ellipse' ? 280 : 200,
          ...baseTransform(nextZIndex(page.elements)),
          fill: shape === 'rect' ? '#4F80FF' : '#A855F7',
          cornerRadius: shape === 'rect' ? 0 : undefined,
          fillGradient: withGradient
            ? {
                type: 'linear',
                angle: 135,
                stops: [
                  { offset: 0, color: '#4F80FF' },
                  { offset: 0.5, color: '#A855F7' },
                  { offset: 1, color: '#FF4EDB' },
                ],
              }
            : undefined,
          effects: {
            shadowColor: '#000000',
            shadowBlur: 40,
            shadowOffsetY: 18,
            shadowOpacity: 0.35,
          },
          animation: { preset: 'scaleIn', duration: 800, trigger: 'scroll' },
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
          width: 420,
          height: 280,
          ...baseTransform(nextZIndex(page.elements)),
          fit: 'cover',
          cornerRadius: 0,
          effects: {
            shadowBlur: 48,
            shadowOffsetY: 24,
            shadowOpacity: 0.4,
          },
          animation: { preset: 'fadeUp', duration: 900, trigger: 'scroll' },
        };
        set({ selectedIds: [el.id], tool: 'select' });
        return { ...page, elements: [...page.elements, el] };
      }),
    );
  },

  addButton: () => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const el: ButtonElement = {
          id: createId(),
          type: 'button',
          label: 'Explorar →',
          x: 80,
          y: 520,
          width: 200,
          height: 52,
          ...baseTransform(nextZIndex(page.elements)),
          fill: '#4F80FF',
          textColor: '#FFFFFF',
          fontFamily: 'Space Grotesk',
          fontSize: 16,
          fontWeight: 600,
          cornerRadius: 999,
          interaction: { href: '#', target: '_blank', hoverScale: 1.04, hoverOpacity: 0.92 },
          animation: { preset: 'fadeUp', delay: 200, duration: 700, trigger: 'scroll' },
          effects: { shadowBlur: 24, shadowOffsetY: 10, shadowOpacity: 0.35, shadowColor: '#4F80FF' },
          name: 'CTA',
        };
        set({ selectedIds: [el.id], tool: 'select' });
        return { ...page, elements: [...page.elements, el] };
      }),
    );
  },

  addVideo: (src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4') => {
    const { activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => {
        const el: VideoElement = {
          id: createId(),
          type: 'video',
          src,
          x: 120,
          y: 200,
          width: 640,
          height: 360,
          ...baseTransform(nextZIndex(page.elements)),
          autoplay: true,
          loop: true,
          muted: true,
          cornerRadius: 12,
          animation: { preset: 'fadeIn', duration: 1000, trigger: 'scroll' },
          name: 'Vídeo',
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

  bringToFront: () => {
    const { selectedIds, activePageId, document } = get();
    if (!document) return;
    const page = getActivePage(document, activePageId);
    if (!page) return;
    const max = Math.max(0, ...page.elements.map((e) => e.zIndex));
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (p) => ({
        ...p,
        elements: p.elements.map((el, i) =>
          selectedIds.includes(el.id) ? { ...el, zIndex: max + 1 + i } : el,
        ),
      })),
    );
  },

  sendToBack: () => {
    const { selectedIds, activePageId } = get();
    get().updateDocument((doc) =>
      withPage(doc, activePageId, (page) => ({
        ...page,
        elements: page.elements.map((el) =>
          selectedIds.includes(el.id) ? { ...el, zIndex: 0 } : el,
        ),
      })),
    );
  },

  alignSelected: (mode) => {
    const { selectedIds, activePageId, document } = get();
    if (!document || selectedIds.length < 1) return;
    const page = getActivePage(document, activePageId);
    if (!page) return;
    const selected = page.elements.filter((el) => selectedIds.includes(el.id));
    if (!selected.length) return;

    const canvasW = document.meta.width;
    const canvasH = document.meta.height;
    const useCanvas = selected.length === 1;
    const minX = Math.min(...selected.map((e) => e.x));
    const maxX = Math.max(...selected.map((e) => e.x + e.width));
    const minY = Math.min(...selected.map((e) => e.y));
    const maxY = Math.max(...selected.map((e) => e.y + e.height));
    const boundsW = maxX - minX;
    const boundsH = maxY - minY;

    get().updateDocument((doc) =>
      withPage(doc, activePageId, (p) => ({
        ...p,
        elements: p.elements.map((el) => {
          if (!selectedIds.includes(el.id)) return el;
          let x = el.x;
          let y = el.y;
          if (mode === 'left') x = useCanvas ? 0 : minX;
          if (mode === 'right') x = useCanvas ? canvasW - el.width : maxX - el.width;
          if (mode === 'centerX')
            x = useCanvas
              ? (canvasW - el.width) / 2
              : minX + (boundsW - el.width) / 2;
          if (mode === 'top') y = useCanvas ? 0 : minY;
          if (mode === 'bottom') y = useCanvas ? canvasH - el.height : maxY - el.height;
          if (mode === 'centerY')
            y = useCanvas
              ? (canvasH - el.height) / 2
              : minY + (boundsH - el.height) / 2;
          return { ...el, x, y };
        }),
      })),
    );

    if ((mode === 'distributeX' || mode === 'distributeY') && selected.length >= 3) {
      const sorted =
        mode === 'distributeX'
          ? [...selected].sort((a, b) => a.x - b.x)
          : [...selected].sort((a, b) => a.y - b.y);
      if (mode === 'distributeX') {
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const span = last.x + last.width - first.x;
        const totalW = sorted.reduce((s, e) => s + e.width, 0);
        const gap = (span - totalW) / (sorted.length - 1);
        let cursor = first.x;
        const positions = new Map<string, number>();
        sorted.forEach((el, i) => {
          if (i === 0) {
            positions.set(el.id, el.x);
            cursor = el.x + el.width + gap;
            return;
          }
          if (i === sorted.length - 1) {
            positions.set(el.id, el.x);
            return;
          }
          positions.set(el.id, cursor);
          cursor += el.width + gap;
        });
        get().updateDocument((doc) =>
          withPage(doc, activePageId, (p) => ({
            ...p,
            elements: p.elements.map((el) =>
              positions.has(el.id) ? { ...el, x: positions.get(el.id)! } : el,
            ),
          })),
        );
      } else {
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const span = last.y + last.height - first.y;
        const totalH = sorted.reduce((s, e) => s + e.height, 0);
        const gap = (span - totalH) / (sorted.length - 1);
        let cursor = first.y;
        const positions = new Map<string, number>();
        sorted.forEach((el, i) => {
          if (i === 0) {
            positions.set(el.id, el.y);
            cursor = el.y + el.height + gap;
            return;
          }
          if (i === sorted.length - 1) {
            positions.set(el.id, el.y);
            return;
          }
          positions.set(el.id, cursor);
          cursor += el.height + gap;
        });
        get().updateDocument((doc) =>
          withPage(doc, activePageId, (p) => ({
            ...p,
            elements: p.elements.map((el) =>
              positions.has(el.id) ? { ...el, y: positions.get(el.id)! } : el,
            ),
          })),
        );
      }
    }
  },

  toggleLockSelected: () => {
    const { selectedIds, activePageId, document } = get();
    if (!document || !selectedIds.length) return;
    const page = getActivePage(document, activePageId);
    const first = page?.elements.find((e) => selectedIds.includes(e.id));
    const nextLocked = !first?.locked;
    get().updateSelected({ locked: nextLocked });
  },

  addPage: () => {
    get().updateDocument((doc) => {
      const page: Page = {
        id: createId(),
        name: `Página ${doc.pages.length + 1}`,
        order: doc.pages.length,
        background: { type: 'background', fill: '#0B0E11' },
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

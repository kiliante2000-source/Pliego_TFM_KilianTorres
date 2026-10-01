import { useCallback, useEffect, useState } from 'react';

export type StudioLayoutWidths = {
  tools: number;
  layers: number;
  inspector: number;
};

/** Bump when clamp rules change so broken 0-width layouts recover. */
const STORAGE_KEY = 'pliego-studio-layout-v2';

export const LAYOUT_DEFAULTS: StudioLayoutWidths = {
  tools: 216,
  layers: 240,
  inspector: 300,
};

/** Usable minimum while open. Collapse is explicit (0), never by overshoot alone. */
export const LAYOUT_LIMITS = {
  tools: { min: 168, max: 340 },
  layers: { min: 180, max: 380 },
  inspector: { min: 220, max: 440 },
} as const;

/** Below this while dragging → snap closed; reopen restores defaults. */
export const COLLAPSE_SNAP = 72;

type PanelKey = keyof StudioLayoutWidths;
type CollapsibleKey = 'layers' | 'inspector';

function clampOpen(key: PanelKey, value: number) {
  const { min, max } = LAYOUT_LIMITS[key];
  return Math.round(Math.min(max, Math.max(min, value)));
}

function readStored(): StudioLayoutWidths {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('pliego-studio-layout-v1');
    if (!raw) return LAYOUT_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<StudioLayoutWidths>;
    const layersRaw = parsed.layers ?? LAYOUT_DEFAULTS.layers;
    const inspectorRaw = parsed.inspector ?? LAYOUT_DEFAULTS.inspector;
    return {
      tools: clampOpen('tools', parsed.tools ?? LAYOUT_DEFAULTS.tools),
      // Recover accidental zeros from v1 as open defaults
      layers: layersRaw <= 0 ? LAYOUT_DEFAULTS.layers : clampOpen('layers', layersRaw),
      inspector: inspectorRaw <= 0 ? LAYOUT_DEFAULTS.inspector : clampOpen('inspector', inspectorRaw),
    };
  } catch {
    return LAYOUT_DEFAULTS;
  }
}

export function useStudioLayout() {
  const [widths, setWidths] = useState<StudioLayoutWidths>(() =>
    typeof window === 'undefined' ? LAYOUT_DEFAULTS : readStored(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
    } catch {
      /* ignore */
    }
  }, [widths]);

  /**
   * Resize while keeping a usable floor. Dragging below COLLAPSE_SNAP
   * collapses layers/inspector; tools never collapse.
   */
  const setPanelWidth = useCallback((key: PanelKey, value: number) => {
    setWidths((prev) => {
      if (key === 'tools') {
        return { ...prev, tools: clampOpen('tools', value) };
      }
      if (value <= COLLAPSE_SNAP) {
        return { ...prev, [key]: 0 };
      }
      return { ...prev, [key]: clampOpen(key, value) };
    });
  }, []);

  const collapsePanel = useCallback((key: CollapsibleKey) => {
    setWidths((prev) => ({ ...prev, [key]: 0 }));
  }, []);

  const expandPanel = useCallback((key: CollapsibleKey) => {
    setWidths((prev) => ({
      ...prev,
      [key]: prev[key] > 0 ? prev[key] : LAYOUT_DEFAULTS[key],
    }));
  }, []);

  const togglePanel = useCallback((key: CollapsibleKey) => {
    setWidths((prev) => ({
      ...prev,
      [key]: prev[key] > 0 ? 0 : LAYOUT_DEFAULTS[key],
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setWidths(LAYOUT_DEFAULTS);
  }, []);

  const focusCanvas = useCallback(() => {
    setWidths({
      tools: LAYOUT_LIMITS.tools.min,
      layers: LAYOUT_LIMITS.layers.min,
      inspector: LAYOUT_LIMITS.inspector.min,
    });
  }, []);

  const focusTools = useCallback(() => {
    setWidths({ tools: 280, layers: 280, inspector: 320 });
  }, []);

  return {
    widths,
    setPanelWidth,
    collapsePanel,
    expandPanel,
    togglePanel,
    resetLayout,
    focusCanvas,
    focusTools,
  };
}

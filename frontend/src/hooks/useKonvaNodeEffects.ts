import { useEffect, type RefObject } from 'react';
import type Konva from 'konva';
import type { ElementEffects } from '../types/document';

/**
 * Konva filters (blur) require node.cache(). Re-cache when geometry or effects change.
 */
export function useKonvaNodeEffects(
  nodeRef: RefObject<Konva.Node | null>,
  effects: ElementEffects | undefined,
  deps: unknown[],
) {
  const blur = effects?.blur ?? 0;

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (blur > 0) {
      node.cache();
    } else {
      node.clearCache();
    }
    node.getLayer()?.batchDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed explicitly
  }, [blur, nodeRef, ...deps]);
}

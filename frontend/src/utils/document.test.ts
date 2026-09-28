import { describe, it, expect } from 'vitest';
import { createEmptyDocument, nextZIndex } from '../utils/document';

describe('document utils', () => {
  it('creates an empty document with one page', () => {
    const doc = createEmptyDocument('Demo', 1080, 1350);
    expect(doc.version).toBe(1);
    expect(doc.pages).toHaveLength(1);
    expect(doc.meta.width).toBe(1080);
  });

  it('computes next z-index', () => {
    expect(nextZIndex([])).toBe(0);
    expect(nextZIndex([{ zIndex: 2 } as never, { zIndex: 5 } as never])).toBe(6);
  });
});

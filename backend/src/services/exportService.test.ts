import { describe, expect, it } from 'vitest';
import { resolveInteractionHref } from './exportService.js';
import type { Page } from '../types/document.js';

const pages: Page[] = [
  {
    id: 'p1',
    name: 'Portada',
    order: 0,
    background: { type: 'background', fill: '#000' },
    elements: [],
  },
  {
    id: 'p2',
    name: 'Interior',
    order: 1,
    background: { type: 'background', fill: '#111' },
    elements: [],
  },
];

describe('resolveInteractionHref', () => {
  it('defaults button empty href to next page', () => {
    expect(resolveInteractionHref(undefined, pages, 'p1', { defaultNextForButton: true })).toEqual({
      kind: 'page',
      value: 'p2',
    });
  });

  it('resolves pliego:prev', () => {
    expect(resolveInteractionHref('pliego:prev', pages, 'p2')).toEqual({
      kind: 'page',
      value: 'p1',
    });
  });

  it('resolves external https', () => {
    expect(resolveInteractionHref('https://pliego.app', pages, 'p1')).toEqual({
      kind: 'external',
      value: 'https://pliego.app',
    });
  });

  it('resolves pliego:page id', () => {
    expect(resolveInteractionHref('pliego:page:p2', pages, 'p1')).toEqual({
      kind: 'page',
      value: 'p2',
    });
  });

  it('resolves site-relative paths against webBase for PDF outside the app', () => {
    expect(
      resolveInteractionHref('/', pages, 'p1', { webBase: 'https://demo.pliego.app/p/manifiesto' }),
    ).toEqual({
      kind: 'external',
      value: 'https://demo.pliego.app/p/manifiesto',
    });
    expect(
      resolveInteractionHref('/contacto', pages, 'p1', { webBase: 'https://pliego.app' }),
    ).toEqual({
      kind: 'external',
      value: 'https://pliego.app/contacto',
    });
  });
});

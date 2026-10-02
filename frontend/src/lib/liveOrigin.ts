const LIVE_ORIGIN = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function liveHref(path: string): string | null {
  if (!LIVE_ORIGIN) return null;
  const url = new URL(path, `${LIVE_ORIGIN}/`);
  return url.toString();
}

/**
 * Stay inside the portfolio chrome: ask the parent wrapper to load the
 * live studio in the iframe instead of replacing the top window.
 */
export function openLiveStudio(path: string) {
  const href = liveHref(path);
  if (!href) return false;
  const url = new URL(href);
  const next = `${url.pathname}${url.search}${url.hash}` || '/';
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'pliego-embed', action: 'open', path: next }, '*');
    return true;
  }
  window.location.href = href;
  return true;
}

const LIVE_ORIGIN = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function liveHref(path: string): string | null {
  if (!LIVE_ORIGIN) return null;
  const url = new URL(path, `${LIVE_ORIGIN}/`);
  url.searchParams.set('from', 'portfolio');
  return url.toString();
}

/** Open the production studio (same tab, above the portfolio iframe). */
export function openLiveStudio(path: string) {
  const href = liveHref(path);
  if (!href) return false;
  (window.top ?? window).location.href = href;
  return true;
}

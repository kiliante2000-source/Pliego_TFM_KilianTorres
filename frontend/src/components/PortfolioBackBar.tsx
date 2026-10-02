import { useEffect, useMemo, useState } from 'react';

const FROM_KEY = 'pliego-from-portfolio';
const BACK_KEY = 'pliego-portfolio-url';
const FALLBACK_BACK = 'https://kiliante2000-source.github.io/portfolio.html';
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap';

const COLORS = [
  { bg: '#ff783a', fg: '#111111' },
  { bg: '#152dff', fg: '#f4f1ea' },
  { bg: '#ec76e5', fg: '#111111' },
  { bg: '#cbf52a', fg: '#111111' },
  { bg: '#ff3838', fg: '#f4f1ea' },
] as const;

function rememberPortfolioOrigin() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (params.get('from') === 'portfolio') {
    sessionStorage.setItem(FROM_KEY, '1');
    if (document.referrer) {
      try {
        sessionStorage.setItem(BACK_KEY, new URL('/portfolio.html', document.referrer).href);
      } catch {
        sessionStorage.setItem(BACK_KEY, FALLBACK_BACK);
      }
    } else if (!sessionStorage.getItem(BACK_KEY)) {
      sessionStorage.setItem(BACK_KEY, FALLBACK_BACK);
    }
  }
}

function shouldShowBar() {
  if (typeof window === 'undefined') return false;
  if (window.self !== window.top) return false;
  rememberPortfolioOrigin();
  if (sessionStorage.getItem(FROM_KEY) === '1') return true;
  return /github\.io|portfolio\.html|127\.0\.0\.1:4174|localhost:4174/.test(document.referrer);
}

export function PortfolioBackBar() {
  const visible = useMemo(() => shouldShowBar(), []);
  const backHref = useMemo(
    () => (typeof window === 'undefined' ? FALLBACK_BACK : sessionStorage.getItem(BACK_KEY) || FALLBACK_BACK),
    [],
  );
  const [hover, setHover] = useState<(typeof COLORS)[number] | null>(null);
  const [last, setLast] = useState(-1);

  useEffect(() => {
    if (!visible || document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, [visible]);

  if (!visible) return null;

  function paint() {
    let next = Math.floor(Math.random() * COLORS.length);
    if (COLORS.length > 1 && next === last) next = (next + 1) % COLORS.length;
    setLast(next);
    setHover(COLORS[next]);
  }

  return (
    <header
      className="sticky top-0 z-[80] flex min-h-[44px] items-center border-b px-3 py-1.5"
      style={{
        background: '#f4f1ea',
        borderColor: '#111',
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
      }}
    >
      <a
        href={backHref}
        className="no-underline"
        style={{
          color: hover?.fg ?? '#111',
          background: hover?.bg ?? '#f4f1ea',
          border: '1px solid #111',
          padding: '6px 10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: 11,
        }}
        onPointerEnter={paint}
        onPointerLeave={() => setHover(null)}
        onFocus={paint}
        onBlur={() => setHover(null)}
      >
        ← volver al portfolio
      </a>
    </header>
  );
}

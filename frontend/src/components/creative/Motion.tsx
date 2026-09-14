import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Soft spotlight that follows the pointer across creative surfaces. */
export function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 180);
      y.set(e.clientY - 180);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[60] hidden h-[360px] w-[360px] rounded-full mix-blend-screen md:block"
      style={{
        left: sx,
        top: sy,
        opacity: visible ? 0.38 : 0,
        background:
          'radial-gradient(circle, rgba(79,128,255,0.28) 0%, rgba(168,85,247,0.14) 38%, transparent 70%)',
      }}
    />
  );
}

export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18 });
  const y = useSpring(my, { stiffness: 220, damping: 18 });

  return (
    <motion.div
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        mx.set(dx * strength);
        my.set(dy * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Marquee({
  items,
  speed = 48,
  reverse = false,
  /** Starting index in the soft brand palette. */
  colorOffset = 0,
  /** ms before this band starts shifting — so paired rows stagger. */
  phaseDelay = 0,
  chrome = 'full',
  /** When false, keeps a fixed wash (useful for the single demo strip). */
  cycle = true,
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  colorOffset?: number;
  phaseDelay?: number;
  chrome?: 'full' | 'bottom';
  cycle?: boolean;
}) {
  // Soft cool washes only — cycle without solid neon slabs.
  const palette = ['#4f80ff', '#8b6cff', '#d65fcf'] as const;
  const [tone, setTone] = useState(colorOffset % palette.length);
  const accent = palette[tone];
  const sequence = [...items, ...items];

  useEffect(() => {
    if (!cycle) return;
    let intervalId = 0;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setTone((t) => (t + 1) % palette.length);
      }, 4200);
    }, phaseDelay);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [cycle, palette.length, phaseDelay]);

  return (
    <div
      className="marquee-band relative overflow-hidden py-4 transition-[background-color,border-color,box-shadow] duration-[1.1s] ease-out sm:py-5"
      style={
        {
          '--marquee-accent': accent,
          background: `linear-gradient(
            180deg,
            color-mix(in srgb, ${accent} 14%, #080b0f),
            color-mix(in srgb, ${accent} 7%, #050608)
          )`,
          borderTop:
            chrome === 'full' ? `1px solid color-mix(in srgb, ${accent} 28%, transparent)` : 'none',
          borderBottom: `1px solid color-mix(in srgb, ${accent} 18%, transparent)`,
          boxShadow: `inset 0 1px 0 color-mix(in srgb, ${accent} 16%, transparent)`,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px transition-[background,opacity] duration-[1.1s] ease-out"
        style={{
          background: `linear-gradient(90deg, transparent 8%, ${accent} 50%, transparent 92%)`,
          opacity: 0.55,
        }}
      />
      <div
        className={`marquee-track flex w-max items-center ${reverse ? 'marquee-track--reverse' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {sequence.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-unit flex items-center">
            <span className="font-display text-[2.35rem] font-extrabold uppercase leading-none tracking-[-0.05em] text-paper/75 sm:text-5xl md:text-6xl">
              {item}
            </span>
            <span
              aria-hidden
              className="marquee-star inline-flex shrink-0 items-center justify-center transition-colors duration-[1.1s] ease-out"
              style={{ color: accent }}
            >
              {/* Flat Y2K four-point star — no glow */}
              <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor" aria-hidden>
                <path d="M12 0.4c.35 3.9 1.55 7.1 3.55 9.05C17.5 11.4 20.7 12.6 24.6 12c-3.9.35-7.1 1.55-9.05 3.55C13.6 17.5 12.4 20.7 12 24.6c-.35-3.9-1.55-7.1-3.55-9.05C6.5 13.6 3.3 12.4-.6 12c3.9-.35 7.1-1.55 9.05-3.55C10.4 6.5 11.6 3.3 12 .4z" />
              </svg>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={['min-w-0', className].filter(Boolean).join(' ')}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

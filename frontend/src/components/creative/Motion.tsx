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
  speed = 42,
  reverse = false,
  /** 0 = cool neon wash, 1 = violet, 2 = soft rosa — fixed tones, no color-jump hitch. */
  tone = 0,
  chrome = 'full',
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  tone?: 0 | 1 | 2;
  chrome?: 'full' | 'bottom';
}) {
  // Cool editorial palette only — no lima/naranja slabs that clash with the mesh.
  const accents = ['#4f80ff', '#8b6cff', '#d65fcf'] as const;
  const accent = accents[tone] ?? accents[0];
  // Two identical sequences = seamless CSS loop (translate -50%).
  const sequence = [...items, ...items];

  return (
    <div
      className={`marquee-band marquee-band--t${tone} relative overflow-hidden py-4 sm:py-5`}
      style={
        {
          '--marquee-accent': accent,
          borderTop:
            chrome === 'full' ? `1px solid color-mix(in srgb, ${accent} 22%, transparent)` : 'none',
          borderBottom: `1px solid color-mix(in srgb, ${accent} 14%, transparent)`,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent 8%, ${accent} 50%, transparent 92%)`,
        }}
      />
      <div
        className={`marquee-track flex w-max items-center ${reverse ? 'marquee-track--reverse' : ''}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {sequence.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-unit flex items-center">
            <span className="font-display text-[2.35rem] font-extrabold uppercase leading-none tracking-[-0.05em] text-paper/72 sm:text-5xl md:text-6xl">
              {item}
            </span>
            <span
              aria-hidden
              className="marquee-star inline-flex shrink-0 items-center justify-center"
              style={{ color: `color-mix(in srgb, ${accent} 50%, #aeb6c2)` }}
            >
              <svg viewBox="0 0 16 16" className="h-full w-full" fill="currentColor" aria-hidden>
                <path d="M8 1.1l1.05 4.55L13.6 6.7l-3.55 1.85L8 13.1 6.0 8.55 2.4 6.7l4.55-1.05L8 1.1z" />
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
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

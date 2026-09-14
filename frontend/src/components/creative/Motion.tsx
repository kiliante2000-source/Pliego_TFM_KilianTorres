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
  speed = 35,
  reverse = false,
  colorOffset = 0,
  phaseDelay = 0,
  chrome = 'full',
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  /** Phase into the brand palette so paired marquees stay different colors. */
  colorOffset?: number;
  /** ms before this track starts shifting color (stagger vs the other row). */
  phaseDelay?: number;
  chrome?: 'full' | 'bottom';
}) {
  const palette = ['#4f80ff', '#a855f7', '#ff4edb', '#ff7a45', '#b2ff3a'] as const;
  const [tone, setTone] = useState(colorOffset % palette.length);
  const row = [...items, ...items, ...items];
  const color = palette[tone];
  // lima / naranja need dark type; cooler brand hues keep light type
  const inkOnFill = tone >= 3;

  useEffect(() => {
    let intervalId = 0;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setTone((t) => (t + 1) % palette.length);
      }, 3200);
    }, phaseDelay);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [palette.length, phaseDelay]);

  return (
    <div
      className="relative overflow-hidden py-6 transition-[background-color,border-color] duration-700 sm:py-7"
      style={{
        backgroundColor: color,
        borderTop: chrome === 'full' ? `3px solid rgba(5,6,8,0.4)` : 'none',
        borderBottom: `3px solid rgba(5,6,8,0.4)`,
      }}
    >
      <motion.div
        className="relative flex w-max gap-10 whitespace-nowrap"
        animate={{ x: reverse ? ['-33.333%', '0%'] : ['0%', '-33.333%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-5xl font-extrabold uppercase tracking-[-0.05em] transition-colors duration-700 sm:text-6xl md:text-7xl"
            style={{ color: inkOnFill ? '#050608' : '#f4f6f8' }}
          >
            {item}
            <span
              className="mx-5 inline-block align-middle text-[0.55em] opacity-80"
              style={{ color: inkOnFill ? '#050608' : '#f4f6f8' }}
            >
              ✦
            </span>
          </span>
        ))}
      </motion.div>
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

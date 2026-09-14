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
        opacity: visible ? 0.22 : 0,
        background:
          'radial-gradient(circle, rgba(79,128,255,0.16) 0%, rgba(168,85,247,0.08) 38%, transparent 70%)',
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
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
}) {
  const row = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-4">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={{ x: reverse ? ['-33.333%', '0%'] : ['0%', '-33.333%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-4xl font-bold uppercase tracking-[-0.05em] text-paper/25 sm:text-6xl"
          >
            {item}
            <span className="mx-6 text-neon">✦</span>
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

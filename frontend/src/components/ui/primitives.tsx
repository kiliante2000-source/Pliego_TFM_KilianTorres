import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/** Editorial fold mark — a pliego (signature sheet), not a letterform. */
export function PliegoMark({ className, size = 28 }: { className?: string; size?: number }) {
  const uid = useId().replace(/:/g, '');
  const foldGrad = `pliego-fold-${uid}`;
  const edgeGrad = `pliego-edge-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Ink plate — slightly sharper radius than a default app tile */}
      <rect width="64" height="64" rx="15" fill="#07090d" />

      <defs>
        <linearGradient id={foldGrad} x1="34" y1="8" x2="58" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F80FF" />
          <stop offset="0.32" stopColor="#A855F7" />
          <stop offset="0.62" stopColor="#FF4EDB" />
          <stop offset="1" stopColor="#FF7A45" />
        </linearGradient>
        <linearGradient id={edgeGrad} x1="12" y1="12" x2="40" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4f6f8" />
          <stop offset="1" stopColor="#c8d0da" />
        </linearGradient>
      </defs>

      {/* Back sheet — kicked stack under the signature */}
      <path
        d="M26 9h24.5a3.8 3.8 0 0 1 3.8 3.8v35.4a3.8 3.8 0 0 1-3.8 3.8H26V9z"
        fill="#141a26"
        transform="rotate(7 38.25 30.5)"
      />

      {/* Second under-sheet for depth */}
      <path
        d="M22 11h24a3.2 3.2 0 0 1 3.2 3.2v33.6a3.2 3.2 0 0 1-3.2 3.2H22V11z"
        fill="#1b2333"
        transform="rotate(3.2 34 29.5)"
      />

      {/* Main paper face */}
      <path d="M11 12h28.5a2.5 2.5 0 0 1 2.5 2.5v35a2.5 2.5 0 0 1-2.5 2.5H11V12z" fill={`url(#${edgeGrad})`} />

      {/* Diagonal fold plane — the pliego turn (chroma only here) */}
      <path d="M39.5 12 55 18.8v28.9L39.5 52V12z" fill={`url(#${foldGrad})`} />

      {/* Fold highlight */}
      <path d="M39.5 12 55 18.8l-1.4.7L39.5 15.2V12z" fill="#fff" fillOpacity="0.32" />

      {/* Crease */}
      <path d="M38.6 12.4h1.9V51.6h-1.9z" fill="#07090d" fillOpacity="0.22" />
      <path d="M39.15 12.4h0.8V51.6h-0.8z" fill="#b2ff3a" fillOpacity="0.55" />

      {/* Registration / crop mark — print-studio cue */}
      <path
        d="M15.5 18h5.5M18.25 15.25v5.5"
        stroke="#07090d"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function PliegoWordmark({
  className,
  variant = 'solid',
}: {
  className?: string;
  variant?: 'solid' | 'gradient' | 'mono';
}) {
  return (
    <span
      className={cn(
        'font-display inline-block overflow-visible text-[1.35rem] font-bold uppercase tracking-[-0.04em]',
        /* Syne’s O paints past the advance width — pad the clip box for background-clip */
        variant === 'gradient' && 'wordmark-cutout pb-[0.1em] pr-[0.22em]',
        variant === 'solid' && 'text-paper',
        variant === 'mono' && 'text-ink',
        className,
      )}
    >
      PLIEGO
    </span>
  );
}

/** Hero wordmark — large, color-shifting brand flow, padded so the O never clips. */
export function PliegoHeroWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-display wordmark-cutout inline-block max-w-full overflow-visible font-extrabold uppercase',
        'pb-[0.08em] pr-[0.28em] text-[clamp(3.8rem,14vw,9.25rem)] leading-[0.88] tracking-[-0.045em]',
        className,
      )}
    >
      PLIEGO
    </span>
  );
}


export function Logo({
  className,
  withMark = true,
  to = '/',
  markSize = 28,
  wordmarkClassName,
}: {
  className?: string;
  withMark?: boolean;
  to?: string;
  markSize?: number;
  wordmarkClassName?: string;
}) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-2.5 no-underline', className)}>
      {withMark ? <PliegoMark size={markSize} /> : null}
      <PliegoWordmark className={cn('transition group-hover:opacity-90', wordmarkClassName)} />
    </Link>
  );
}

const buttonVariants = {
  primary:
    'btn-brand-flow hover:brightness-[1.04]',
  ghost: 'bg-transparent text-paper-muted hover:bg-ink-3 hover:text-paper',
  soft: 'btn-brand-soft',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
  lima: 'bg-lima/90 text-ink hover:brightness-95',
} as const;

type ButtonVariant = keyof typeof buttonVariants;

function buttonClassName(variant: ButtonVariant, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    buttonVariants[variant],
    className,
  );
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return <button type={type} className={buttonClassName(variant, className)} {...props} />;
}

export function ButtonLink({
  className,
  variant = 'primary',
  to,
  children,
  ...props
}: React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
}) {
  return (
    <Link to={to} className={buttonClassName(variant, className)} {...props}>
      {children}
    </Link>
  );
}

export function Input({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-left">
      {label ? (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-paper-muted">
          {label}
        </span>
      ) : null}
      <input
        className={cn(
          'rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-sm text-paper placeholder:text-paper-muted/50 outline-none transition focus:border-neon focus:bg-ink-2',
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function Textarea({
  className,
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-left">
      {label ? (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-paper-muted">
          {label}
        </span>
      ) : null}
      <textarea
        className={cn(
          'min-h-24 rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-sm text-paper outline-none transition focus:border-neon focus:bg-ink-2',
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function Select({
  className,
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-left">
      {label ? (
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-paper-muted">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          'rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-sm text-paper outline-none transition focus:border-neon focus:bg-ink-2',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

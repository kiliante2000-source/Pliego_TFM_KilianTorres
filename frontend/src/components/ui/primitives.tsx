import { Link } from 'react-router-dom';
import { useId } from 'react';
import { cn } from '../../utils/cn';

export function PliegoMark({ className, size = 28 }: { className?: string; size?: number }) {
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
      <rect width="64" height="64" rx="14" fill="#0B0E11" />
      <defs>
        <linearGradient id="pliegoP" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F80FF" />
          <stop offset="0.25" stopColor="#FF4EDB" />
          <stop offset="0.5" stopColor="#A855F7" />
          <stop offset="0.75" stopColor="#B2FF3A" />
          <stop offset="1" stopColor="#FF7A45" />
        </linearGradient>
      </defs>
      <path
        fill="url(#pliegoP)"
        d="M18 14h16.5c7.4 0 12.5 4.2 12.5 11.2 0 7.1-5.1 11.3-12.5 11.3H26.2V50H18V14zm8.2 15.2h7.8c3.2 0 5.2-1.7 5.2-4 0-2.4-2-4-5.2-4h-7.8v8z"
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

/** Hero wordmark as SVG so the final O cannot be clipped by overflow / background-clip. */
export function PliegoHeroWordmark({ className }: { className?: string }) {
  const raw = useId().replace(/:/g, '');
  const gradId = `pliego-hero-${raw}`;

  return (
    <svg
      viewBox="0 0 760 160"
      className={cn('block h-auto w-full max-w-[40rem] overflow-visible', className)}
      role="img"
      aria-label="PLIEGO"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#4f80ff" />
          <stop offset="25%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ff4edb" />
          <stop offset="75%" stopColor="#ff7a45" />
          <stop offset="100%" stopColor="#b2ff3a" />
        </linearGradient>
      </defs>
      <text
        x="12"
        y="122"
        fill={`url(#${gradId})`}
        fontFamily="Syne, 'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
        fontSize="128"
        fontWeight="800"
        letterSpacing="-0.04em"
        style={{ textTransform: 'uppercase' }}
      >
        PLIEGO
      </text>
    </svg>
  );
}

export function Logo({
  className,
  withMark = true,
  to = '/',
}: {
  className?: string;
  withMark?: boolean;
  to?: string;
}) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-2.5 no-underline', className)}>
      {withMark ? <PliegoMark size={28} /> : null}
      <PliegoWordmark className="transition group-hover:opacity-90" />
    </Link>
  );
}

const buttonVariants = {
  primary:
    'btn-brand-flow shadow-[0_10px_32px_rgba(79,128,255,0.22)] hover:brightness-[1.06]',
  ghost: 'bg-transparent text-paper-muted hover:bg-ink-3 hover:text-paper',
  soft: 'btn-brand-soft',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
  lima: 'bg-lima text-ink shadow-[0_8px_24px_rgba(178,255,58,0.22)] hover:brightness-95',
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

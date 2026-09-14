import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/** Brand mark — modern geometric P on corporate chroma wash. */
export function PliegoMark({ className, size = 28 }: { className?: string; size?: number }) {
  const uid = useId().replace(/:/g, '');
  const washId = `pliego-wash-${uid}`;

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
      <defs>
        <linearGradient id={washId} x1="4" y1="2" x2="60" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F80FF" />
          <stop offset="0.28" stopColor="#A855F7" />
          <stop offset="0.55" stopColor="#FF4EDB" />
          <stop offset="0.78" stopColor="#FF7A45" />
          <stop offset="1" stopColor="#B2FF3A" />
        </linearGradient>
      </defs>

      {/* Chroma plate */}
      <rect width="64" height="64" rx="15" fill={`url(#${washId})`} />

      {/* Soft inner depth so the black P sits with more punch */}
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="13"
        fill="#050608"
        fillOpacity="0.12"
      />

      {/* Modern geometric P — wide stem, tight bowl, Syne-adjacent display cut */}
      <path
        fill="#050608"
        d="M17 11h18.2c9.35 0 15.55 5.15 15.55 13.35 0 8.35-6.35 13.55-15.75 13.55H25.4V53H17V11zm8.4 7.1v12.7h8.85c4.85 0 7.95-2.75 7.95-6.4 0-3.55-3.05-6.3-7.85-6.3H25.4z"
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

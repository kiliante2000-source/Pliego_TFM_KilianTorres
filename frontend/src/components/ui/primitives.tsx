import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/** Brand mark — vertically flattened modern P on a vivid corporate chroma wash. */
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
        {/* Even brand bands so neon / violet / rosa / naranja / lima all read */}
        <linearGradient id={washId} x1="2" y1="6" x2="62" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F80FF" />
          <stop offset="0.2" stopColor="#7B5CFF" />
          <stop offset="0.38" stopColor="#A855F7" />
          <stop offset="0.52" stopColor="#FF4EDB" />
          <stop offset="0.68" stopColor="#FF7A45" />
          <stop offset="0.84" stopColor="#D4FF3A" />
          <stop offset="1" stopColor="#B2FF3A" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="15" fill={`url(#${washId})`} />

      {/* Flattened display P — wide body, vertically compressed like Syne display */}
      <path
        fill="#050608"
        d="M14.5 15.5h22.8c10.4 0 17.4 4.55 17.4 12.15 0 7.7-7.1 12.35-17.6 12.35H24.8V48.5H14.5V15.5zm10.3 6.4v11.3h11.2c5.35 0 8.85-2.45 8.85-5.7 0-3.15-3.4-5.6-8.7-5.6H24.8z"
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

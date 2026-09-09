import { Link } from 'react-router-dom';
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
          <stop offset="0.45" stopColor="#A855F7" />
          <stop offset="1" stopColor="#FF4EDB" />
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
        'font-display inline-block text-[1.35rem] font-bold uppercase tracking-[-0.06em]',
        variant === 'gradient' && 'wordmark-cutout',
        variant === 'solid' && 'text-paper',
        variant === 'mono' && 'text-ink',
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
    'bg-neon text-white shadow-[0_0_0_1px_rgba(79,128,255,0.35)] hover:bg-accent-2 hover:shadow-[0_10px_30px_rgba(79,128,255,0.28)]',
  ghost: 'bg-transparent text-paper-muted hover:bg-ink-3 hover:text-paper',
  soft: 'bg-ink-3 text-paper ring-1 ring-line-soft hover:bg-ink-4',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
  lima: 'bg-lima text-ink hover:brightness-95',
} as const;

type ButtonVariant = keyof typeof buttonVariants;

function buttonClassName(variant: ButtonVariant, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold no-underline transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
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

import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <Link to="/" className={cn('group inline-flex items-baseline gap-2.5 no-underline', className)}>
      <span className="font-display text-[1.65rem] font-semibold tracking-[-0.03em] text-paper transition duration-300 group-hover:text-accent">
        Pliego
      </span>
      {!markOnly ? (
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-paper-muted sm:inline">
          Studio
        </span>
      ) : null}
    </Link>
  );
}

const buttonVariants = {
  primary:
    'bg-accent text-ink shadow-[0_0_0_1px_rgba(227,160,69,0.35)] hover:bg-accent-2 hover:shadow-[0_8px_24px_rgba(227,160,69,0.22)]',
  ghost: 'bg-transparent text-paper-muted hover:bg-ink-3 hover:text-paper',
  soft: 'bg-ink-3/90 text-paper ring-1 ring-line-soft hover:bg-ink-4 hover:text-paper',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
} as const;

type ButtonVariant = keyof typeof buttonVariants;

function buttonClassName(variant: ButtonVariant, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold no-underline transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50',
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
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper-muted">
          {label}
        </span>
      ) : null}
      <input
        className={cn(
          'rounded-lg border border-line bg-ink/60 px-3.5 py-2.5 text-sm text-paper placeholder:text-paper-muted/50 outline-none transition duration-200 focus:border-accent focus:bg-ink-2',
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
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper-muted">
          {label}
        </span>
      ) : null}
      <textarea
        className={cn(
          'min-h-24 rounded-lg border border-line bg-ink/60 px-3.5 py-2.5 text-sm text-paper outline-none transition duration-200 focus:border-accent focus:bg-ink-2',
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
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper-muted">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          'rounded-lg border border-line bg-ink/60 px-3.5 py-2.5 text-sm text-paper outline-none transition duration-200 focus:border-accent focus:bg-ink-2',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-paper-muted">{children}</p>;
}

import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('group inline-flex items-baseline gap-2 no-underline', className)}>
      <span className="font-display text-2xl font-semibold tracking-tight text-paper transition group-hover:text-accent">
        Pliego
      </span>
      <span className="hidden text-[11px] uppercase tracking-[0.22em] text-paper-muted sm:inline">
        Studio
      </span>
    </Link>
  );
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'soft';
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-accent text-ink hover:bg-accent-2',
        variant === 'ghost' && 'bg-transparent text-paper hover:bg-ink-3',
        variant === 'soft' && 'bg-ink-3 text-paper hover:bg-line',
        variant === 'danger' && 'bg-danger/20 text-danger hover:bg-danger/30',
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-left">
      {label ? <span className="text-xs font-medium uppercase tracking-wider text-paper-muted">{label}</span> : null}
      <input
        className={cn(
          'rounded-md border border-line bg-ink-2 px-3 py-2.5 text-sm text-paper placeholder:text-paper-muted/60 outline-none transition focus:border-accent',
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
      {label ? <span className="text-xs font-medium uppercase tracking-wider text-paper-muted">{label}</span> : null}
      <textarea
        className={cn(
          'min-h-24 rounded-md border border-line bg-ink-2 px-3 py-2.5 text-sm text-paper outline-none transition focus:border-accent',
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
      {label ? <span className="text-xs font-medium uppercase tracking-wider text-paper-muted">{label}</span> : null}
      <select
        className={cn(
          'rounded-md border border-line bg-ink-2 px-3 py-2.5 text-sm text-paper outline-none transition focus:border-accent',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

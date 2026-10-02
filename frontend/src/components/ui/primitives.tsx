import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Brand lockup helpers.
 * `translate="no"` + `.notranslate` keep PLIEGO from becoming “Fold” / “Sheet”
 * under Chrome / Google Translate (pliego ≈ fold in Spanish print jargon).
 */
export const BRAND_NAME = 'PLIEGO' as const;

/** Inline brand name — never translated. */
export function BrandName({ className }: { className?: string }) {
  return (
    <span className={cn('notranslate', className)} lang="es" translate="no">
      {BRAND_NAME}
    </span>
  );
}

/**
 * Brand mark — favicon asset.
 * `default`: degradado + P negra · `inverse`: cuadrado negro + P en colores PLIEGO
 */
export function PliegoMark({
  className,
  size = 28,
  variant = 'default',
}: {
  className?: string;
  size?: number;
  variant?: 'default' | 'inverse';
}) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const src =
    variant === 'inverse'
      ? `${base}brand/pliego-mark-inverse.svg`
      : `${base}brand/pliego-mark.svg`;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={cn('notranslate inline-block shrink-0 select-none', className)}
      lang="es"
      translate="no"
      style={{ width: size, height: size }}
    />
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
        'notranslate font-display inline-block overflow-visible text-[1.35rem] font-bold uppercase tracking-[-0.04em]',
        /* Syne’s O paints past the advance width — pad the clip box for background-clip */
        variant === 'gradient' && 'wordmark-cutout pb-[0.1em] pr-[0.22em]',
        variant === 'solid' && 'text-paper',
        variant === 'mono' && 'text-ink',
        className,
      )}
      lang="es"
      translate="no"
    >
      {BRAND_NAME}
    </span>
  );
}

/** Hero wordmark — large, color-shifting brand flow, padded so the O never clips. */
export function PliegoHeroWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'notranslate font-display wordmark-cutout inline-block max-w-full overflow-visible font-extrabold uppercase',
        /* Floor tuned for ~360px phones; desktop max unchanged */
        'pb-[0.08em] pr-[0.28em] text-[clamp(2.45rem,12.5vw,9.25rem)] leading-[0.88] tracking-[-0.045em]',
        className,
      )}
      lang="es"
      translate="no"
    >
      {BRAND_NAME}
    </span>
  );
}

/**
 * Wordmark PLIEGO plano (mayúsculas) para paneles de color.
 * Color sólido — sin sombreado pesado; padding para que la O no se corte.
 */
export function PliegoFoldWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn('pliego-fold notranslate', className)}
      lang="es"
      translate="no"
      aria-label="PLIEGO"
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
    <Link
      to={to}
      aria-label={BRAND_NAME}
      className={cn('group notranslate inline-flex items-center gap-2.5 no-underline', className)}
      translate="no"
    >
      {withMark ? <PliegoMark size={markSize} /> : null}
      <PliegoWordmark className={cn('transition group-hover:opacity-90', wordmarkClassName)} />
    </Link>
  );
}

const buttonVariants = {
  primary:
    'btn-brand-flow hover:brightness-[1.04]',
  ghost: 'bg-transparent text-paper/70 hover:bg-ink-3 hover:text-paper',
  soft: 'btn-brand-soft',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25',
  lima: 'bg-lima/90 text-ink hover:brightness-95',
} as const;

type ButtonVariant = keyof typeof buttonVariants;

function buttonClassName(variant: ButtonVariant, className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold no-underline transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-base',
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
  type,
  value,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  if (type === 'color') {
    const hex = typeof value === 'string' && value ? value : '#000000';
    return (
      <label className="flex w-full flex-col gap-1.5 text-left">
        {label ? (
          <span className="font-mono text-base font-medium uppercase tracking-[0.14em] text-paper/70">
            {label}
          </span>
        ) : null}
        <span className="flex items-center gap-2.5 rounded-xl border border-line bg-ink/70 p-2 transition focus-within:border-neon focus-within:bg-ink-2">
          <input
            type="color"
            value={hex}
            className={cn(
              'h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-white/15 bg-transparent p-0.5',
              className,
            )}
            {...props}
          />
          <span className="min-w-0 flex-1 font-mono text-sm uppercase tracking-[0.08em] text-paper/85">
            {hex}
          </span>
        </span>
      </label>
    );
  }

  return (
    <label className="flex w-full flex-col gap-1.5 text-left">
      {label ? (
        <span className="font-mono text-base font-medium uppercase tracking-[0.14em] text-paper/70">
          {label}
        </span>
      ) : null}
      <input
        type={type}
        value={value}
        className={cn(
          'rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-base text-paper placeholder:text-paper/55 outline-none transition focus:border-neon focus:bg-ink-2',
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
        <span className="font-mono text-base font-medium uppercase tracking-[0.14em] text-paper/70">
          {label}
        </span>
      ) : null}
      <textarea
        className={cn(
          'min-h-24 rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-base text-paper outline-none transition focus:border-neon focus:bg-ink-2',
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
        <span className="font-mono text-base font-medium uppercase tracking-[0.14em] text-paper/70">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          'rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-base text-paper outline-none transition focus:border-neon focus:bg-ink-2',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

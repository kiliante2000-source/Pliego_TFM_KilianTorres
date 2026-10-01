import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Square,
  Play,
  MousePointer2,
  X,
  Sparkles,
  ChevronRight,
  LayoutTemplate,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const STORAGE_KEY = 'pliego-studio-guide-v1';

const STEPS = [
  {
    id: 'insert',
    eyebrow: '01 · Insertar',
    title: 'Añade tipografía, formas y bloques',
    body: 'En la barra izquierda, Insertar: T abre tipografía, el cuadrado abre formas, el icono de plantilla inserta composiciones listas.',
    icon: Type,
    accent: 'text-neon',
  },
  {
    id: 'edit',
    eyebrow: '02 · Editar',
    title: 'Selecciona y ajusta en el Inspector',
    body: 'Clic en un elemento del lienzo. A la derecha cambias tamaño, color, tipografía y efectos. Doble clic en un texto para editarlo en el canvas.',
    icon: MousePointer2,
    accent: 'text-rosa',
  },
  {
    id: 'motion',
    eyebrow: '03 · Motion',
    title: 'Anima y previsualiza',
    body: 'Con un elemento seleccionado, abre Motion en el Inspector. Pulsa Preview (o ⌘P) para ver el movimiento como en la publicación.',
    icon: Play,
    accent: 'text-lima',
  },
  {
    id: 'compose',
    eyebrow: '04 · Componer',
    title: 'Bloques y kit de marca',
    body: 'Sin selección, el Inspector muestra bloques editoriales y el kit de colores PLIEGO. Úsalos para montar páginas con ritmo de estudio.',
    icon: LayoutTemplate,
    accent: 'text-violet',
  },
] as const;

export function useStudioGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'done') {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'done');
    } catch {
      /* ignore */
    }
    setOpen(false);
    setStep(0);
  };

  const openGuide = () => {
    setStep(0);
    setOpen(true);
  };

  return { open, step, setStep, finish, openGuide, setOpen };
}

export function StudioGuideOverlay({
  open,
  step,
  onStep,
  onClose,
  onFinish,
}: {
  open: boolean;
  step: number;
  onStep: (n: number) => void;
  onClose: () => void;
  onFinish: () => void;
}) {
  const current = STEPS[step] ?? STEPS[0];
  const Icon = current.icon;
  const isLast = step >= STEPS.length - 1;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Cerrar guía"
            className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-labelledby="studio-guide-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/12 bg-ink-2 shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-neon/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-rosa/15 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3 border-b border-white/8 px-5 py-4">
              <div>
                <p className="eyebrow text-neon">Guía del estudio</p>
                <p className="mt-1 font-mono text-sm uppercase tracking-[0.14em] text-paper/55">
                  {step + 1} / {STEPS.length}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full text-paper/60 transition hover:bg-white/5 hover:text-paper"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative px-5 py-6">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={cn(
                    'grid h-12 w-12 place-items-center rounded-xl bg-ink-3 ring-1 ring-white/10',
                    current.accent,
                  )}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <p className={cn('eyebrow', current.accent)}>{current.eyebrow}</p>
              </div>
              <h2
                id="studio-guide-title"
                className="font-display text-2xl font-extrabold tracking-[-0.04em] text-paper sm:text-3xl"
              >
                {current.title}
              </h2>
              <p className="mt-3 font-serif text-lg leading-relaxed text-paper/70">{current.body}</p>

              <div className="mt-6 flex gap-1.5">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Paso ${i + 1}`}
                    onClick={() => onStep(i)}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition',
                      i === step ? 'bg-neon' : i < step ? 'bg-neon/40' : 'bg-white/10',
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-between gap-3 border-t border-white/8 px-5 py-4">
              <button
                type="button"
                className="text-sm font-medium text-paper/55 transition hover:text-paper"
                onClick={onFinish}
              >
                Saltar guía
              </button>
              <div className="flex gap-2">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => onStep(step - 1)}
                    className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-paper/80 transition hover:bg-white/5"
                  >
                    Atrás
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => (isLast ? onFinish() : onStep(step + 1))}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neon px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-2"
                >
                  {isLast ? (
                    <>
                      <Sparkles size={15} /> Empezar a crear
                    </>
                  ) : (
                    <>
                      Siguiente <ChevronRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function StudioHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Guía del estudio"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-ink-2/80 px-3 py-2 text-sm font-semibold text-paper/80 transition hover:border-neon/40 hover:text-paper"
    >
      <HelpCircle size={15} />
      <span className="hidden sm:inline">Guía</span>
    </button>
  );
}

/** Empty-canvas starter — shown when the page has no elements. */
export function CanvasStarter({
  onAddText,
  onAddShape,
  onAddBlock,
  onOpenGuide,
}: {
  onAddText: () => void;
  onAddShape: () => void;
  onAddBlock: () => void;
  onOpenGuide: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6"
    >
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/12 bg-ink-2/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <p className="eyebrow text-neon">Lienzo vacío</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-paper">
          Empieza por aquí
        </h3>
        <p className="mt-2 font-serif text-base leading-relaxed text-paper/65">
          Un clic inserta en el centro. Luego selecciónalo y afina tipografía, color o motion a la
          derecha.
        </p>
        <div className="mt-5 grid gap-2">
          <StarterBtn
            icon={<Type size={16} />}
            label="Añadir titular"
            hint="Tipografía display"
            onClick={onAddText}
          />
          <StarterBtn
            icon={<Square size={16} />}
            label="Añadir forma con gradiente"
            hint="Rectángulo neón PLIEGO"
            onClick={onAddShape}
          />
          <StarterBtn
            icon={<LayoutTemplate size={16} />}
            label="Insertar bloque editorial"
            hint="Hero tipográfico listo"
            onClick={onAddBlock}
          />
        </div>
        <button
          type="button"
          onClick={onOpenGuide}
          className="mt-4 w-full text-center text-sm font-medium text-neon transition hover:underline"
        >
          Ver guía del estudio (2 min)
        </button>
      </div>
    </motion.div>
  );
}

function StarterBtn({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-ink-3/80 px-3 py-3 text-left transition hover:border-neon/35 hover:bg-ink-3"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-neon">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-paper">{label}</span>
        <span className="block text-sm text-paper/55">{hint}</span>
      </span>
      <ChevronRight size={16} className="shrink-0 text-paper/40" />
    </button>
  );
}

import type { CanvasElement, DocumentModel, Page } from '../types/document';
import { createId, nextZIndex } from '../utils/document';
import { BRAND_GRADIENT_STOPS, PLIEGO_BRAND } from '../brand/pliegoBrand';

export type EditorialBlockId =
  | 'hero-display'
  | 'quote-rule'
  | 'image-caption'
  | 'cta-cluster'
  | 'masthead';

export const EDITORIAL_BLOCKS: {
  id: EditorialBlockId;
  label: string;
  hint: string;
}[] = [
  { id: 'hero-display', label: 'Hero tipográfico', hint: 'Display + caption de volumen' },
  { id: 'quote-rule', label: 'Cita editorial', hint: 'Pull quote + regla de acento' },
  { id: 'image-caption', label: 'Imagen + pie', hint: 'Marco visual con caption mono' },
  { id: 'cta-cluster', label: 'CTA + apoyo', hint: 'Botón marca + línea de soporte' },
  { id: 'masthead', label: 'Masthead', hint: 'Volumen + título de sección' },
];

function base(z: number) {
  return { rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, zIndex: z };
}

/** Construye una composición lista para insertar en la página activa. */
export function buildEditorialBlock(
  id: EditorialBlockId,
  page: Page,
  doc: DocumentModel,
): CanvasElement[] {
  const z0 = nextZIndex(page.elements);
  const ox = Math.round(doc.meta.width * 0.08);
  const oy = Math.round(doc.meta.height * 0.1) + (page.elements.length % 4) * 20;

  if (id === 'hero-display') {
    return [
      {
        id: createId(),
        type: 'text',
        name: 'Display',
        x: ox,
        y: oy,
        width: Math.min(860, doc.meta.width - ox * 2),
        height: 220,
        ...base(z0),
        text: 'LA FORMA\nES EL\nMENSAJE',
        style: {
          fontSize: Math.round(doc.meta.width * 0.075),
          fontFamily: 'Syne',
          fontWeight: 800,
          color: PLIEGO_BRAND.paper,
          align: 'left',
          lineHeight: 0.9,
          letterSpacing: -3,
          textTransform: 'uppercase',
        },
        animation: { preset: 'fadeUp', duration: 900, trigger: 'load' },
      },
      {
        id: createId(),
        type: 'text',
        name: 'Vol',
        x: ox,
        y: oy + 240,
        width: 420,
        height: 36,
        ...base(z0 + 1),
        text: 'PLIEGO  ·  VOL. 01',
        style: {
          fontSize: 13,
          fontFamily: 'JetBrains Mono',
          fontWeight: 600,
          color: PLIEGO_BRAND.neon,
          align: 'left',
          letterSpacing: 3,
          textTransform: 'uppercase',
        },
        animation: { preset: 'fadeIn', delay: 120, duration: 700, trigger: 'load' },
      },
    ];
  }

  if (id === 'quote-rule') {
    return [
      {
        id: createId(),
        type: 'shape',
        shape: 'rect',
        name: 'Rule',
        x: ox,
        y: oy,
        width: 64,
        height: 6,
        ...base(z0),
        fill: PLIEGO_BRAND.rosa,
        animation: { preset: 'slideRight', duration: 600, trigger: 'load' },
      },
      {
        id: createId(),
        type: 'text',
        name: 'Quote',
        x: ox,
        y: oy + 28,
        width: Math.min(640, doc.meta.width - ox * 2),
        height: 160,
        ...base(z0 + 1),
        text: '“La página digital es un escenario,\nno un contenedor.”',
        style: {
          fontSize: 34,
          fontFamily: 'Instrument Serif',
          fontWeight: 400,
          color: PLIEGO_BRAND.paper,
          align: 'left',
          lineHeight: 1.25,
          italic: true,
        },
        animation: { preset: 'blurIn', duration: 1000, trigger: 'scroll' },
      },
    ];
  }

  if (id === 'image-caption') {
    const w = Math.min(520, doc.meta.width - ox * 2);
    return [
      {
        id: createId(),
        type: 'shape',
        shape: 'rect',
        name: 'Frame',
        x: ox,
        y: oy,
        width: w,
        height: Math.round(w * 0.68),
        ...base(z0),
        fill: PLIEGO_BRAND.ink2,
        fillGradient: {
          type: 'linear',
          angle: 135,
          stops: BRAND_GRADIENT_STOPS,
        },
        effects: { shadowBlur: 40, shadowOffsetY: 18, shadowOpacity: 0.35 },
        animation: { preset: 'scaleIn', duration: 800, trigger: 'scroll' },
      },
      {
        id: createId(),
        type: 'text',
        name: 'Caption',
        x: ox,
        y: oy + Math.round(w * 0.68) + 16,
        width: w,
        height: 40,
        ...base(z0 + 1),
        text: 'FIG. 01  ·  ESTUDIO EN VIVO',
        style: {
          fontSize: 12,
          fontFamily: 'JetBrains Mono',
          fontWeight: 500,
          color: PLIEGO_BRAND.muted,
          align: 'left',
          letterSpacing: 2,
          textTransform: 'uppercase',
        },
        animation: { preset: 'fadeIn', delay: 100, duration: 600, trigger: 'load' },
      },
    ];
  }

  if (id === 'cta-cluster') {
    return [
      {
        id: createId(),
        type: 'button',
        name: 'CTA',
        label: 'Explorar pieza →',
        x: ox,
        y: oy,
        width: 220,
        height: 52,
        ...base(z0),
        fill: PLIEGO_BRAND.neon,
        textColor: '#FFFFFF',
        fontFamily: 'Space Grotesk',
        fontSize: 16,
        fontWeight: 600,
        cornerRadius: 999,
        interaction: { href: 'pliego:next', target: '_self', hoverScale: 1.04, hoverOpacity: 0.92 },
        animation: { preset: 'fadeUp', duration: 700, trigger: 'load' },
        effects: {
          shadowBlur: 24,
          shadowOffsetY: 10,
          shadowOpacity: 0.35,
          shadowColor: PLIEGO_BRAND.neon,
        },
      },
      {
        id: createId(),
        type: 'text',
        name: 'Support',
        x: ox + 240,
        y: oy + 12,
        width: 320,
        height: 40,
        ...base(z0 + 1),
        text: 'Publica al instante · PDF listo',
        style: {
          fontSize: 15,
          fontFamily: 'DM Sans',
          fontWeight: 500,
          color: PLIEGO_BRAND.muted,
          align: 'left',
          lineHeight: 1.4,
        },
        animation: { preset: 'fadeIn', delay: 150, duration: 700, trigger: 'load' },
      },
    ];
  }

  // masthead
  return [
    {
      id: createId(),
      type: 'text',
      name: 'Masthead',
      x: ox,
      y: oy,
      width: 360,
      height: 32,
      ...base(z0),
      text: 'PLIEGO  ·  ESTUDIO',
      style: {
        fontSize: 12,
        fontFamily: 'JetBrains Mono',
        fontWeight: 600,
        color: PLIEGO_BRAND.lima,
        align: 'left',
        letterSpacing: 4,
        textTransform: 'uppercase',
      },
      animation: { preset: 'fadeIn', duration: 500, trigger: 'load' },
    },
    {
      id: createId(),
      type: 'text',
      name: 'Section',
      x: ox,
      y: oy + 36,
      width: Math.min(720, doc.meta.width - ox * 2),
      height: 72,
      ...base(z0 + 1),
      text: 'Sección editorial',
      style: {
        fontSize: 48,
        fontFamily: 'Syne',
        fontWeight: 800,
        color: PLIEGO_BRAND.paper,
        align: 'left',
        letterSpacing: -1.5,
      },
      animation: { preset: 'fadeUp', duration: 800, trigger: 'load' },
    },
  ];
}

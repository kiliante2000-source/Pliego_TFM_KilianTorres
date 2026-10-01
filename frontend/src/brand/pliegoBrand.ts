/** Identidad corporativa PLIEGO — fuente única para herramientas funcionales. */
export const PLIEGO_BRAND = {
  neon: '#4F80FF',
  accent2: '#3A6AEF',
  violet: '#A855F7',
  rosa: '#FF4EDB',
  lima: '#B2FF3A',
  naranja: '#FF7A45',
  ink: '#050608',
  ink2: '#0B0E11',
  paper: '#F4F6F8',
  muted: '#8B95A3',
} as const;

export const BRAND_SWATCHES = [
  { id: 'neon', label: 'Neón', color: PLIEGO_BRAND.neon },
  { id: 'rosa', label: 'Rosa', color: PLIEGO_BRAND.rosa },
  { id: 'violet', label: 'Violeta', color: PLIEGO_BRAND.violet },
  { id: 'lima', label: 'Lima', color: PLIEGO_BRAND.lima },
  { id: 'naranja', label: 'Naranja', color: PLIEGO_BRAND.naranja },
  { id: 'paper', label: 'Paper', color: PLIEGO_BRAND.paper },
  { id: 'ink', label: 'Ink', color: PLIEGO_BRAND.ink },
] as const;

export const BRAND_GRADIENT_STOPS = [
  { offset: 0, color: PLIEGO_BRAND.neon },
  { offset: 0.25, color: PLIEGO_BRAND.rosa },
  { offset: 0.5, color: PLIEGO_BRAND.violet },
  { offset: 0.75, color: PLIEGO_BRAND.lima },
  { offset: 1, color: PLIEGO_BRAND.naranja },
];

export const ARTBOARD_PRESETS = [
  { id: 'story', label: 'Story / vertical', width: 1080, height: 1350, orientation: 'portrait' as const },
  { id: 'feed', label: 'Feed cuadrado', width: 1080, height: 1080, orientation: 'portrait' as const },
  { id: 'slide', label: 'Slide / landscape', width: 1920, height: 1080, orientation: 'landscape' as const },
  { id: 'web', label: 'Web wide', width: 1440, height: 900, orientation: 'landscape' as const },
  { id: 'revista', label: 'Revista', width: 1200, height: 1600, orientation: 'portrait' as const },
  { id: 'cover', label: 'Portada A4-ish', width: 1240, height: 1754, orientation: 'portrait' as const },
] as const;

export type BrandAccent = (typeof BRAND_SWATCHES)[number]['id'];

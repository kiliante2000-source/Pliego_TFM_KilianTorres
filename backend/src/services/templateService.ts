import type { CanvasElement, DocumentModel, Page } from '../types/document.js';
import { createEmptyDocument } from '../types/document.js';

function id() {
  return crypto.randomUUID();
}

const FONT = 'Space Grotesk';
const MONO = 'JetBrains Mono';
const DISPLAY = 'Syne';
const SERIF = 'Instrument Serif';
const BODY = 'DM Sans';

function base(z: number) {
  return {
    rotation: 0 as const,
    scaleX: 1 as const,
    scaleY: 1 as const,
    opacity: 1,
    zIndex: z,
  };
}

export type TemplateDef = {
  id: string;
  name: string;
  category: 'portada' | 'revista' | 'catalogo' | 'presentacion' | 'editorial';
  description: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  build: () => DocumentModel;
};

function page(
  name: string,
  order: number,
  fill: string,
  elements: CanvasElement[],
): Page {
  return {
    id: id(),
    name,
    order,
    background: { type: 'background', fill },
    elements,
  };
}

/** Multi-page digital magazine cover + story — Readymag energy */
function buildManifestoDigital(): DocumentModel {
  const w = 1440;
  const h = 900;
  const doc = createEmptyDocument('Manifesto digital', w, h);
  doc.pages = [
    page('Portada', 0, '#07090C', [
      {
        id: id(),
        type: 'shape',
        shape: 'ellipse',
        x: 780,
        y: -120,
        width: 820,
        height: 820,
        ...base(0),
        fill: '#4F80FF',
        fillGradient: {
          type: 'radial',
          stops: [
            { offset: 0, color: '#FF4EDB' },
            { offset: 0.45, color: '#A855F7' },
            { offset: 1, color: '#07090C' },
          ],
        },
        opacity: 0.85,
        animation: { preset: 'scaleIn', duration: 1200, trigger: 'load' },
        effects: { blur: 0, blendMode: 'screen' },
      },
      {
        id: id(),
        type: 'text',
        x: 72,
        y: 120,
        width: 420,
        height: 40,
        ...base(1),
        text: 'PLIEGO  ·  VOL. 03',
        style: {
          fontSize: 14,
          fontFamily: MONO,
          fontWeight: 600,
          color: '#4F80FF',
          align: 'left',
          letterSpacing: 4,
          textTransform: 'uppercase',
        },
        animation: { preset: 'fadeIn', delay: 100, trigger: 'load' },
      },
      {
        id: id(),
        type: 'text',
        x: 72,
        y: 220,
        width: 900,
        height: 280,
        ...base(2),
        text: 'LA FORMA\nES EL\nMENSAJE',
        name: 'Display',
        style: {
          fontSize: 118,
          fontFamily: DISPLAY,
          fontWeight: 800,
          color: '#F4F6F8',
          align: 'left',
          lineHeight: 0.9,
          letterSpacing: -4,
          textTransform: 'uppercase',
        },
        animation: { preset: 'fadeUp', duration: 1000, trigger: 'load' },
      },
      {
        id: id(),
        type: 'text',
        x: 72,
        y: 620,
        width: 520,
        height: 100,
        ...base(3),
        text: 'Una publicación digital interactiva.\nScroll, motion y tipografía como dirección de arte.',
        style: {
          fontSize: 20,
          fontFamily: BODY,
          fontWeight: 400,
          color: '#8B95A3',
          align: 'left',
          lineHeight: 1.45,
        },
        animation: { preset: 'fadeUp', delay: 220, trigger: 'load' },
      },
      {
        id: id(),
        type: 'button',
        label: 'Entrar al relato →',
        x: 72,
        y: 760,
        width: 220,
        height: 52,
        ...base(4),
        fill: '#F4F6F8',
        textColor: '#07090C',
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 600,
        cornerRadius: 999,
        interaction: { href: '#', target: '_self', hoverScale: 1.05 },
        animation: { preset: 'fadeUp', delay: 360, trigger: 'load' },
        effects: { shadowBlur: 28, shadowOffsetY: 12, shadowOpacity: 0.35 },
      },
    ]),
    page('Editorial', 1, '#F4F1EA', [
      {
        id: id(),
        type: 'shape',
        shape: 'rect',
        x: 0,
        y: 0,
        width: 480,
        height: 900,
        ...base(0),
        fill: '#0B0E11',
      },
      {
        id: id(),
        type: 'text',
        x: 56,
        y: 80,
        width: 360,
        height: 40,
        ...base(1),
        text: 'ENSAYO',
        style: {
          fontSize: 13,
          fontFamily: MONO,
          fontWeight: 600,
          color: '#4F80FF',
          align: 'left',
          letterSpacing: 5,
        },
        animation: { preset: 'slideRight', trigger: 'scroll' },
      },
      {
        id: id(),
        type: 'text',
        x: 56,
        y: 140,
        width: 380,
        height: 220,
        ...base(2),
        text: 'Diseñar\npara el\nscroll',
        style: {
          fontSize: 64,
          fontFamily: DISPLAY,
          fontWeight: 700,
          color: '#F4F6F8',
          align: 'left',
          lineHeight: 1.02,
          letterSpacing: -2,
        },
        animation: { preset: 'fadeUp', trigger: 'scroll', duration: 900 },
      },
      {
        id: id(),
        type: 'text',
        x: 56,
        y: 420,
        width: 360,
        height: 280,
        ...base(3),
        text: 'El lienzo digital no imita el papel: lo supera. Cada bloque puede entrar, enlazar y respirar. Motion no es adorno — es jerarquía.',
        style: {
          fontSize: 18,
          fontFamily: BODY,
          fontWeight: 400,
          color: '#8B95A3',
          align: 'left',
          lineHeight: 1.55,
        },
        animation: { preset: 'fadeIn', delay: 120, trigger: 'scroll' },
      },
      {
        id: id(),
        type: 'text',
        x: 560,
        y: 120,
        width: 780,
        height: 200,
        ...base(4),
        text: '“Una página memorable no se lee: se habita.”',
        style: {
          fontSize: 48,
          fontFamily: SERIF,
          fontWeight: 400,
          color: '#111111',
          align: 'left',
          lineHeight: 1.2,
          italic: true,
        },
        animation: { preset: 'blurIn', trigger: 'scroll', duration: 1100 },
      },
      {
        id: id(),
        type: 'shape',
        shape: 'rect',
        x: 560,
        y: 360,
        width: 120,
        height: 4,
        ...base(5),
        fill: '#FF4EDB',
        animation: { preset: 'slideLeft', trigger: 'scroll' },
      },
      {
        id: id(),
        type: 'text',
        x: 560,
        y: 400,
        width: 720,
        height: 320,
        ...base(6),
        text: 'Usa tipografía display para el golpe visual, serif para la voz editorial y mono para metadatos. Combina CTAs, vídeo y gradientes como capas de dirección de arte — no como widgets genéricos.\n\nPublica. Comparte. Itera. El producto final debe sentir estudio creativo, no plantilla de presentación.',
        style: {
          fontSize: 20,
          fontFamily: BODY,
          fontWeight: 400,
          color: '#2A2F36',
          align: 'left',
          lineHeight: 1.55,
        },
        animation: { preset: 'fadeUp', delay: 160, trigger: 'scroll' },
      },
    ]),
    page('Cierre', 2, '#0B0E11', [
      {
        id: id(),
        type: 'shape',
        shape: 'rect',
        x: 0,
        y: 0,
        width: 1440,
        height: 900,
        ...base(0),
        fill: '#0B0E11',
        fillGradient: {
          type: 'linear',
          angle: 160,
          stops: [
            { offset: 0, color: '#0B0E11' },
            { offset: 0.55, color: '#121826' },
            { offset: 1, color: '#1a1030' },
          ],
        },
      },
      {
        id: id(),
        type: 'text',
        x: 120,
        y: 280,
        width: 1200,
        height: 160,
        ...base(1),
        text: 'HAZ ALGO\nIMPOSIBLE DE IGNORAR',
        style: {
          fontSize: 72,
          fontFamily: DISPLAY,
          fontWeight: 800,
          color: '#F4F6F8',
          align: 'center',
          lineHeight: 0.95,
          letterSpacing: -2,
        },
        animation: { preset: 'scaleIn', trigger: 'scroll', duration: 1000 },
      },
      {
        id: id(),
        type: 'button',
        label: 'Publicar con PLIEGO',
        x: 560,
        y: 520,
        width: 320,
        height: 56,
        ...base(2),
        fill: '#4F80FF',
        textColor: '#FFFFFF',
        fontFamily: FONT,
        fontSize: 16,
        fontWeight: 600,
        cornerRadius: 999,
        interaction: { href: '/', target: '_blank', hoverScale: 1.06 },
        animation: { preset: 'fadeUp', delay: 200, trigger: 'scroll' },
        effects: {
          shadowColor: '#4F80FF',
          shadowBlur: 36,
          shadowOffsetY: 14,
          shadowOpacity: 0.45,
        },
      },
    ]),
  ];
  doc.meta.width = w;
  doc.meta.height = h;
  return doc;
}

function buildPortfolioKinetic(): DocumentModel {
  const w = 1080;
  const h = 1350;
  const doc = createEmptyDocument('Portfolio kinetic', w, h);
  doc.pages = [
    page('Hero', 0, '#0B0E11', [
      {
        id: id(),
        type: 'shape',
        shape: 'rect',
        x: 0,
        y: 980,
        width: 1080,
        height: 370,
        ...base(0),
        fill: '#4F80FF',
        fillGradient: {
          type: 'linear',
          angle: 90,
          stops: [
            { offset: 0, color: '#4F80FF' },
            { offset: 1, color: '#FF4EDB' },
          ],
        },
      },
      {
        id: id(),
        type: 'text',
        x: 64,
        y: 120,
        width: 900,
        height: 80,
        ...base(1),
        text: 'STUDIO / 2026',
        style: {
          fontSize: 16,
          fontFamily: MONO,
          fontWeight: 500,
          color: '#8B95A3',
          align: 'left',
          letterSpacing: 6,
        },
        animation: { preset: 'fadeIn', trigger: 'load' },
      },
      {
        id: id(),
        type: 'text',
        x: 64,
        y: 220,
        width: 950,
        height: 360,
        ...base(2),
        text: 'Trabajos\nque se\nsienten',
        style: {
          fontSize: 120,
          fontFamily: DISPLAY,
          fontWeight: 800,
          color: '#F4F6F8',
          align: 'left',
          lineHeight: 0.92,
          letterSpacing: -5,
        },
        animation: { preset: 'fadeUp', duration: 1100, trigger: 'load' },
      },
      {
        id: id(),
        type: 'text',
        x: 64,
        y: 1040,
        width: 700,
        height: 120,
        ...base(3),
        text: 'Dirección de arte · Editorial digital · Identidad',
        style: {
          fontSize: 22,
          fontFamily: BODY,
          fontWeight: 500,
          color: '#0B0E11',
          align: 'left',
          lineHeight: 1.3,
        },
        animation: { preset: 'slideLeft', delay: 200, trigger: 'load' },
      },
      {
        id: id(),
        type: 'button',
        label: 'Ver proyectos',
        x: 64,
        y: 1180,
        width: 180,
        height: 48,
        ...base(4),
        fill: '#0B0E11',
        textColor: '#F4F6F8',
        cornerRadius: 999,
        fontSize: 14,
        fontWeight: 600,
        interaction: { href: '#', hoverScale: 1.04 },
        animation: { preset: 'fadeUp', delay: 280, trigger: 'load' },
      },
    ]),
    page('Case', 1, '#F7F5F0', [
      {
        id: id(),
        type: 'text',
        x: 64,
        y: 80,
        width: 400,
        height: 40,
        ...base(0),
        text: '01  —  CASE STUDY',
        style: {
          fontSize: 13,
          fontFamily: MONO,
          fontWeight: 600,
          color: '#A855F7',
          align: 'left',
          letterSpacing: 3,
        },
        animation: { preset: 'fadeIn', trigger: 'scroll' },
      },
      {
        id: id(),
        type: 'text',
        x: 64,
        y: 160,
        width: 900,
        height: 160,
        ...base(1),
        text: 'Revista líquida\npara una marca cultural',
        style: {
          fontSize: 52,
          fontFamily: 'Playfair Display',
          fontWeight: 700,
          color: '#111111',
          align: 'left',
          lineHeight: 1.1,
        },
        animation: { preset: 'fadeUp', trigger: 'scroll' },
      },
      {
        id: id(),
        type: 'shape',
        shape: 'rect',
        x: 64,
        y: 400,
        width: 952,
        height: 520,
        ...base(2),
        fill: '#111318',
        cornerRadius: 8,
        fillGradient: {
          type: 'linear',
          angle: 145,
          stops: [
            { offset: 0, color: '#1a2230' },
            { offset: 1, color: '#4F80FF' },
          ],
        },
        animation: { preset: 'scaleIn', trigger: 'scroll', duration: 900 },
        effects: { shadowBlur: 48, shadowOffsetY: 24, shadowOpacity: 0.3 },
      },
      {
        id: id(),
        type: 'text',
        x: 100,
        y: 560,
        width: 800,
        height: 120,
        ...base(3),
        text: 'Imagen / vídeo / tipografía\nen un solo scroll narrativo',
        style: {
          fontSize: 36,
          fontFamily: FONT,
          fontWeight: 600,
          color: '#F4F6F8',
          align: 'left',
          lineHeight: 1.2,
        },
        animation: { preset: 'fadeUp', delay: 180, trigger: 'scroll' },
      },
      {
        id: id(),
        type: 'text',
        x: 64,
        y: 980,
        width: 900,
        height: 200,
        ...base(4),
        text: 'Sustituye este bloque por tu fotografía o vídeo. Ajusta motion en el inspector: fade, scale, blur. Enlaza el CTA a tu estudio o a la siguiente página publicada.',
        style: {
          fontSize: 18,
          fontFamily: BODY,
          fontWeight: 400,
          color: '#4A5560',
          align: 'left',
          lineHeight: 1.55,
        },
        animation: { preset: 'fadeIn', delay: 100, trigger: 'scroll' },
      },
    ]),
  ];
  doc.meta.width = w;
  doc.meta.height = h;
  return doc;
}

function buildPortadaEditorial(): DocumentModel {
  const doc = createEmptyDocument('Portada editorial', 1080, 1350);
  doc.pages[0].background.fill = '#0B0E11';
  doc.pages[0].elements = [
    {
      id: id(),
      type: 'shape',
      shape: 'rect',
      x: 0,
      y: 0,
      width: 18,
      height: 1350,
      ...base(0),
      fill: '#4F80FF',
    },
    {
      id: id(),
      type: 'shape',
      shape: 'ellipse',
      x: 580,
      y: 140,
      width: 620,
      height: 620,
      ...base(1),
      fill: '#A855F7',
      fillGradient: {
        type: 'radial',
        stops: [
          { offset: 0, color: '#FF4EDB' },
          { offset: 0.6, color: '#A855F7' },
          { offset: 1, color: '#0B0E11' },
        ],
      },
      opacity: 0.9,
      animation: { preset: 'scaleIn', duration: 1200, trigger: 'load' },
      effects: { blendMode: 'screen' },
    },
    {
      id: id(),
      type: 'text',
      x: 72,
      y: 200,
      width: 900,
      height: 160,
      ...base(2),
      text: 'PLiEGO',
      style: {
        fontSize: 110,
        fontFamily: DISPLAY,
        fontWeight: 800,
        color: '#F4F6F8',
        align: 'left',
        letterSpacing: -3,
      },
      animation: { preset: 'fadeUp', trigger: 'load' },
    },
    {
      id: id(),
      type: 'text',
      x: 72,
      y: 400,
      width: 720,
      height: 120,
      ...base(3),
      text: 'Diseño editorial.\nTecnología. Sin límites.',
      style: {
        fontSize: 36,
        fontFamily: FONT,
        fontWeight: 500,
        color: '#8B95A3',
        align: 'left',
        lineHeight: 1.25,
      },
      animation: { preset: 'fadeUp', delay: 160, trigger: 'load' },
    },
    {
      id: id(),
      type: 'button',
      label: 'Abrir número →',
      x: 72,
      y: 1120,
      width: 200,
      height: 48,
      ...base(4),
      fill: '#4F80FF',
      textColor: '#fff',
      cornerRadius: 999,
      interaction: { href: '#', hoverScale: 1.05 },
      animation: { preset: 'fadeUp', delay: 280, trigger: 'load' },
    },
  ];
  return doc;
}

function buildRevista(): DocumentModel {
  const doc = createEmptyDocument('Revista', 1200, 1600);
  doc.pages[0].background.fill = '#0B0E11';
  doc.pages[0].elements = [
    {
      id: id(),
      type: 'text',
      x: 80,
      y: 90,
      width: 400,
      height: 40,
      ...base(0),
      text: 'REPORTAJE',
      style: {
        fontSize: 14,
        fontFamily: MONO,
        fontWeight: 600,
        color: '#4F80FF',
        align: 'left',
        letterSpacing: 4,
      },
      animation: { preset: 'fadeIn', trigger: 'load' },
    },
    {
      id: id(),
      type: 'text',
      x: 80,
      y: 160,
      width: 1000,
      height: 180,
      ...base(1),
      text: 'La forma como\nsistema editorial',
      style: {
        fontSize: 64,
        fontFamily: DISPLAY,
        fontWeight: 700,
        color: '#F4F6F8',
        align: 'left',
        lineHeight: 1.05,
        letterSpacing: -2,
      },
      animation: { preset: 'fadeUp', trigger: 'load' },
    },
    {
      id: id(),
      type: 'shape',
      shape: 'rect',
      x: 80,
      y: 420,
      width: 1040,
      height: 520,
      ...base(2),
      fill: '#151a22',
      cornerRadius: 4,
      fillGradient: {
        type: 'linear',
        angle: 120,
        stops: [
          { offset: 0, color: '#151a22' },
          { offset: 1, color: '#2a1850' },
        ],
      },
      animation: { preset: 'scaleIn', trigger: 'scroll' },
      effects: { shadowBlur: 40, shadowOffsetY: 20, shadowOpacity: 0.4 },
    },
    {
      id: id(),
      type: 'text',
      x: 80,
      y: 1000,
      width: 1000,
      height: 280,
      ...base(3),
      text: 'Tipografía, ritmo y contraste. Sustituye el bloque central por imagen o vídeo, activa motion al scroll y publica una experiencia que se sienta revista viva — no un PDF plano.',
      style: {
        fontSize: 22,
        fontFamily: BODY,
        fontWeight: 400,
        color: '#8B95A3',
        align: 'left',
        lineHeight: 1.5,
      },
      animation: { preset: 'fadeUp', delay: 120, trigger: 'scroll' },
    },
  ];
  return doc;
}

function buildCatalogo(): DocumentModel {
  const doc = createEmptyDocument('Catálogo', 1080, 1350);
  doc.pages[0].background.fill = '#F7F5F0';
  doc.pages[0].elements = [
    {
      id: id(),
      type: 'text',
      x: 64,
      y: 64,
      width: 400,
      height: 40,
      ...base(0),
      text: 'LOOKBOOK',
      style: {
        fontSize: 13,
        fontFamily: MONO,
        fontWeight: 600,
        color: '#A855F7',
        align: 'left',
        letterSpacing: 4,
      },
    },
    {
      id: id(),
      type: 'text',
      x: 64,
      y: 120,
      width: 900,
      height: 100,
      ...base(1),
      text: 'Objetos con carácter',
      style: {
        fontSize: 56,
        fontFamily: 'Playfair Display',
        fontWeight: 700,
        color: '#111',
        align: 'left',
      },
      animation: { preset: 'fadeUp', trigger: 'load' },
    },
    {
      id: id(),
      type: 'shape',
      shape: 'rect',
      x: 64,
      y: 280,
      width: 440,
      height: 560,
      ...base(2),
      fill: '#0B0E11',
      cornerRadius: 8,
      animation: { preset: 'fadeUp', trigger: 'scroll' },
      effects: { shadowBlur: 32, shadowOffsetY: 16, shadowOpacity: 0.25 },
    },
    {
      id: id(),
      type: 'shape',
      shape: 'rect',
      x: 540,
      y: 280,
      width: 440,
      height: 560,
      ...base(3),
      fill: '#4F80FF',
      fillGradient: {
        type: 'linear',
        angle: 160,
        stops: [
          { offset: 0, color: '#4F80FF' },
          { offset: 1, color: '#FF4EDB' },
        ],
      },
      cornerRadius: 8,
      animation: { preset: 'fadeUp', delay: 120, trigger: 'scroll' },
    },
    {
      id: id(),
      type: 'button',
      label: 'Shop the edit',
      x: 64,
      y: 920,
      width: 200,
      height: 48,
      ...base(4),
      fill: '#111',
      textColor: '#fff',
      cornerRadius: 999,
      interaction: { href: '#', target: '_blank', hoverScale: 1.05 },
      animation: { preset: 'fadeUp', trigger: 'scroll' },
    },
  ];
  return doc;
}

function buildPresentacion(): DocumentModel {
  const doc = createEmptyDocument('Presentación', 1920, 1080);
  doc.pages[0].background.fill = '#0B0E11';
  doc.pages[0].elements = [
    {
      id: id(),
      type: 'shape',
      shape: 'ellipse',
      x: 1200,
      y: -100,
      width: 900,
      height: 900,
      ...base(0),
      fill: '#A855F7',
      opacity: 0.35,
      fillGradient: {
        type: 'radial',
        stops: [
          { offset: 0, color: '#FF4EDB' },
          { offset: 1, color: '#0B0E11' },
        ],
      },
      animation: { preset: 'scaleIn', trigger: 'load', duration: 1400 },
    },
    {
      id: id(),
      type: 'text',
      x: 120,
      y: 320,
      width: 1400,
      height: 200,
      ...base(1),
      text: 'Pitch con\npresencia',
      style: {
        fontSize: 96,
        fontFamily: DISPLAY,
        fontWeight: 800,
        color: '#F4F6F8',
        align: 'left',
        lineHeight: 0.95,
        letterSpacing: -3,
      },
      animation: { preset: 'fadeUp', trigger: 'load' },
    },
    {
      id: id(),
      type: 'button',
      label: 'Siguiente idea →',
      x: 120,
      y: 640,
      width: 220,
      height: 52,
      ...base(2),
      fill: '#F4F6F8',
      textColor: '#0B0E11',
      cornerRadius: 999,
      interaction: { href: '#', hoverScale: 1.04 },
      animation: { preset: 'fadeUp', delay: 200, trigger: 'load' },
    },
  ];
  return doc;
}

export const templates: TemplateDef[] = [
  {
    id: 'manifesto-digital',
    name: 'Manifesto digital',
    category: 'editorial',
    description: '3 páginas cinematográficas: portada, ensayo y cierre con motion y CTA.',
    width: 1440,
    height: 900,
    orientation: 'landscape',
    build: buildManifestoDigital,
  },
  {
    id: 'portfolio-kinetic',
    name: 'Portfolio kinetic',
    category: 'editorial',
    description: 'Portfolio vertical con hero tipográfico y case study animado.',
    width: 1080,
    height: 1350,
    orientation: 'portrait',
    build: buildPortfolioKinetic,
  },
  {
    id: 'portada-editorial',
    name: 'Portada editorial',
    category: 'portada',
    description: 'Portada tipográfica con gradiente neón e interacción.',
    width: 1080,
    height: 1350,
    orientation: 'portrait',
    build: buildPortadaEditorial,
  },
  {
    id: 'revista-doble',
    name: 'Página de revista',
    category: 'revista',
    description: 'Maquetación tipográfica con bloque visual y motion al scroll.',
    width: 1200,
    height: 1600,
    orientation: 'portrait',
    build: buildRevista,
  },
  {
    id: 'catalogo-producto',
    name: 'Catálogo / lookbook',
    category: 'catalogo',
    description: 'Lookbook dual con CTA y sombras editoriales.',
    width: 1080,
    height: 1350,
    orientation: 'portrait',
    build: buildCatalogo,
  },
  {
    id: 'presentacion-slide',
    name: 'Presentación slide',
    category: 'presentacion',
    description: 'Slide widescreen con display tipográfico y CTA.',
    width: 1920,
    height: 1080,
    orientation: 'landscape',
    build: buildPresentacion,
  },
];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id);
}

export function listTemplates() {
  return templates.map(({ build: _b, ...meta }) => meta);
}

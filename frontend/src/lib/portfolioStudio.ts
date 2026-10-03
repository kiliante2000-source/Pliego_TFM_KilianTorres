import { createEmptyDocument } from '../utils/document';
import type { DocumentModel, Project, User } from '../types/document';

const DB_KEY = 'pliego-portfolio-studio-v1';

const TEMPLATES = [
  {
    id: 'manifesto-digital',
    name: 'Manifiesto digital',
    category: 'editorial',
    description: '3 actos: portada neón, ensayo tipográfico y cierre con CTA.',
    width: 1440,
    height: 900,
    orientation: 'landscape',
  },
  {
    id: 'portfolio-kinetic',
    name: 'Portfolio kinetic',
    category: 'editorial',
    description: 'Hero tipográfico, case study animado y cierre publicable.',
    width: 1080,
    height: 1350,
    orientation: 'portrait',
  },
  {
    id: 'portada-editorial',
    name: 'Portada editorial',
    category: 'portada',
    description: 'Cover PLIEGO + cuerpo editorial interactivo + cierre.',
    width: 1080,
    height: 1350,
    orientation: 'portrait',
  },
  {
    id: 'revista-doble',
    name: 'Página de revista',
    category: 'revista',
    description: 'Portada, ensayo a dos columnas y cierre con motion.',
    width: 1200,
    height: 1600,
    orientation: 'portrait',
  },
  {
    id: 'catalogo-producto',
    name: 'Catálogo / lookbook',
    category: 'catalogo',
    description: 'Lookbook SS26: hero, edit dual y cierre shoppable.',
    width: 1080,
    height: 1350,
    orientation: 'portrait',
  },
  {
    id: 'presentacion-slide',
    name: 'Presentación slide',
    category: 'presentacion',
    description: 'Apertura, argumento y cierre widescreen con CTAs.',
    width: 1920,
    height: 1080,
    orientation: 'landscape',
  },
] as const;

type StudioUser = User & { passwordHash: string };
type StudioProject = Project;
type StudioVersion = {
  id: string;
  projectId: string;
  userId: string;
  versionNumber: number;
  label: string;
  createdAt: string;
  document: DocumentModel;
};
type StudioAsset = {
  id: string;
  projectId: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
  dataUrl: string;
};
type StudioExport = { id: string; projectId: string; title: string; createdAt: string };
type Session = { token: string; userId: string };
type StudioDb = {
  users: StudioUser[];
  sessions: Session[];
  projects: StudioProject[];
  versions: StudioVersion[];
  assets: StudioAsset[];
  exports: StudioExport[];
};

class StudioError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

export function isPortfolioStudio() {
  return String(import.meta.env.BASE_URL).includes('/works/pliego');
}

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return crypto.randomUUID();
}

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `${base || 'proyecto'}-${uid().slice(0, 8)}`;
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`pliego:${text}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function loadDb(): StudioDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as StudioDb;
  } catch {
    /* private mode */
  }
  return { users: [], sessions: [], projects: [], versions: [], assets: [], exports: [] };
}

function saveDb(db: StudioDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function publicUser(user: StudioUser): User {
    const { passwordHash, ...rest } = user;
    void passwordHash;
    return rest;
}

function assetView(asset: StudioAsset, project: StudioProject) {
  return {
    id: asset.id,
    projectId: asset.projectId,
    filename: asset.filename,
    mimeType: asset.mimeType,
    size: asset.size,
    createdAt: asset.createdAt,
    url: asset.dataUrl,
    project: { id: project.id, title: project.title, slug: project.slug },
  };
}

function readAuth(init?: RequestInit) {
  const headers = init?.headers;
  let value = '';
  if (headers instanceof Headers) value = headers.get('Authorization') || '';
  else if (Array.isArray(headers)) {
    value = headers.find(([key]) => key.toLowerCase() === 'authorization')?.[1] || '';
  } else if (headers) {
    const rec = headers as Record<string, string>;
    value = rec.Authorization || rec.authorization || '';
  }
  return value.startsWith('Bearer ') ? value.slice(7).trim() : '';
}

async function readJson(init?: RequestInit) {
  const body = init?.body;
  if (!body) return {};
  if (typeof body === 'string') return JSON.parse(body || '{}');
  if (body instanceof FormData) return Object.fromEntries(body.entries());
  if (body instanceof Blob) return JSON.parse(await body.text());
  return {};
}

function requireUser(db: StudioDb, init?: RequestInit) {
  const token = readAuth(init);
  const session = db.sessions.find((s) => s.token === token);
  const user = session ? db.users.find((u) => u.id === session.userId) : undefined;
  if (!user) throw new StudioError('No autenticado', 401, 'UNAUTHORIZED');
  return user;
}

function requireProject(db: StudioDb, id: string, ownerId: string) {
  const project = db.projects.find((p) => p.id === id && p.ownerId === ownerId);
  if (!project) throw new StudioError('Proyecto no encontrado', 404, 'NOT_FOUND');
  return project;
}

function makePdf(title: string) {
  const text = title.slice(0, 72).replace(/[()\\]/g, ' ');
  const stream = `BT /F1 20 Tf 72 720 Td (${text}) Tj ET`;
  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n',
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new Blob([pdf], { type: 'application/pdf' });
}

async function ensureDemo(db: StudioDb) {
  if (db.users.some((u) => u.email === 'demo@pliego.app')) return;
  db.users.push({
    id: uid(),
    name: 'Demo PLIEGO',
    email: 'demo@pliego.app',
    role: 'user',
    status: 'active',
    lastLoginAt: null,
    createdAt: nowIso(),
    passwordHash: await sha256('demo1234'),
  });
}

async function handle(path: string, search: string, init?: RequestInit): Promise<unknown | Blob> {
  const db = loadDb();
  await ensureDemo(db);
  const method = (init?.method || 'GET').toUpperCase();
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const parts = path.replace(/\/+$/, '').split('/').filter(Boolean);

  const json = async () => (await readJson(init)) as Record<string, unknown>;

  if (path === '/api/health' && method === 'GET') return { ok: true };

  if (path === '/api/auth/register' && method === 'POST') {
    const body = await json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const confirm = body.confirmPassword;
    if (name.length < 2) throw new StudioError('El nombre es demasiado corto', 400);
    if (!email.includes('@')) throw new StudioError('Email no válido', 400);
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new StudioError('La contraseña debe incluir al menos una letra y un número', 400);
    }
    if (confirm !== undefined && String(confirm) !== password) {
      throw new StudioError('Las contraseñas no coinciden', 400);
    }
    if (db.users.some((u) => u.email === email)) {
      throw new StudioError('Ese email ya está registrado', 409, 'EMAIL_TAKEN');
    }
    const user: StudioUser = {
      id: uid(),
      name,
      email,
      role: 'user',
      status: 'active',
      lastLoginAt: nowIso(),
      createdAt: nowIso(),
      passwordHash: await sha256(password),
    };
    const token = uid();
    db.users.push(user);
    db.sessions.push({ token, userId: user.id });
    saveDb(db);
    return { user: publicUser(user), token };
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const body = await json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = db.users.find((u) => u.email === email);
    if (!user || user.passwordHash !== (await sha256(password))) {
      throw new StudioError('Email o contraseña incorrectos', 401, 'INVALID_CREDENTIALS');
    }
    user.lastLoginAt = nowIso();
    const token = uid();
    db.sessions.push({ token, userId: user.id });
    saveDb(db);
    return { user: publicUser(user), token };
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    const token = readAuth(init);
    db.sessions = db.sessions.filter((s) => s.token !== token);
    saveDb(db);
    return { ok: true };
  }

  if (path === '/api/auth/me' && method === 'GET') {
    try {
      return { user: publicUser(requireUser(db, init)) };
    } catch {
      return { user: null };
    }
  }

  if (path === '/api/auth/me' && method === 'PATCH') {
    const user = requireUser(db, init);
    const body = await json();
    const name = String(body.name || user.name).trim();
    if (name.length < 2) throw new StudioError('El nombre es demasiado corto', 400);
    user.name = name;
    saveDb(db);
    return { user: publicUser(user) };
  }

  if (path === '/api/projects/templates' && method === 'GET') {
    requireUser(db, init);
    return { templates: TEMPLATES };
  }

  if (path === '/api/projects/library/assets' && method === 'GET') {
    const user = requireUser(db, init);
    const owned = db.projects.filter((p) => p.ownerId === user.id);
    return {
      assets: db.assets
        .filter((a) => owned.some((p) => p.id === a.projectId))
        .map((a) => assetView(a, owned.find((p) => p.id === a.projectId)!)),
    };
  }

  if (path === '/api/projects/library/versions' && method === 'GET') {
    const user = requireUser(db, init);
    const owned = db.projects.filter((p) => p.ownerId === user.id);
    return {
      versions: db.versions
        .filter((v) => owned.some((p) => p.id === v.projectId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 40)
        .map((v) => {
          const project = owned.find((p) => p.id === v.projectId)!;
          return {
            id: v.id,
            projectId: v.projectId,
            versionNumber: v.versionNumber,
            label: v.label,
            createdAt: v.createdAt,
            user: { id: user.id, name: user.name },
            project: {
              id: project.id,
              title: project.title,
              slug: project.slug,
              width: project.width,
              height: project.height,
            },
          };
        }),
    };
  }

  if (parts[0] === 'api' && parts[1] === 'projects' && parts[2] === 'library' && parts[3] === 'assets' && parts[4] && method === 'DELETE') {
    const user = requireUser(db, init);
    const asset = db.assets.find((a) => a.id === parts[4]);
    const project = asset ? db.projects.find((p) => p.id === asset.projectId) : undefined;
    if (!asset || project?.ownerId !== user.id) throw new StudioError('Recurso no encontrado', 404);
    db.assets = db.assets.filter((a) => a.id !== asset.id);
    saveDb(db);
    return undefined;
  }

  if (parts[0] === 'api' && parts[1] === 'projects' && parts[2] === 'exports' && parts[3] && parts[4] === 'download' && method === 'GET') {
    const user = requireUser(db, init);
    const row = db.exports.find((e) => e.id === parts[3]);
    const project = row ? db.projects.find((p) => p.id === row.projectId) : undefined;
    if (!row || project?.ownerId !== user.id) throw new StudioError('Exportación no encontrada', 404);
    return makePdf(row.title);
  }

  if (path === '/api/projects' && method === 'GET') {
    const user = requireUser(db, init);
    const status = params.get('status');
    const q = (params.get('q') || '').trim().toLowerCase();
    let list = db.projects.filter((p) => p.ownerId === user.id);
    list = status ? list.filter((p) => p.status === status) : list.filter((p) => p.status !== 'archived');
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return { projects: list, total: list.length };
  }

  if (path === '/api/projects' && method === 'POST') {
    const user = requireUser(db, init);
    const body = await json();
    const title = String(body.title || 'Sin título').trim() || 'Sin título';
    const template = TEMPLATES.find((t) => t.id === body.templateId);
    const width = Number(template?.width || body.width || 1080);
    const height = Number(template?.height || body.height || 1350);
    const orientation = String(template?.orientation || body.orientation || 'portrait');
    const project: StudioProject = {
      id: uid(),
      ownerId: user.id,
      title,
      slug: slugify(title),
      width,
      height,
      orientation,
      status: 'active',
      visibility: 'private',
      published: false,
      document: createEmptyDocument(title, width, height, {
        templateId: template?.id,
        templateName: template?.name,
      }),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      authorName: user.name,
    };
    db.projects.push(project);
    saveDb(db);
    return { project };
  }

  if (parts[0] === 'api' && parts[1] === 'public' && parts[2] && method === 'GET') {
    const project = db.projects.find((p) => p.slug === parts[2] && p.published && p.visibility === 'public');
    if (!project) throw new StudioError('Proyecto no encontrado', 404);
    return { project };
  }

  if (parts[0] === 'api' && parts[1] === 'assets' && parts[2] && parts[3] === 'file' && method === 'GET') {
    const asset = db.assets.find((a) => a.id === parts[2]);
    if (!asset) throw new StudioError('Recurso no encontrado', 404);
    return asset.dataUrl;
  }

  if (parts[0] === 'api' && parts[1] === 'projects' && parts[2]) {
    const user = requireUser(db, init);
    const projectId = parts[2];
    const project = requireProject(db, projectId, user.id);
    const rest = parts.slice(3);

    if (rest.length === 0 && method === 'GET') return { project };
    if (rest.length === 0 && method === 'PATCH') {
      const body = await json();
      if (typeof body.title === 'string' && body.title.trim()) project.title = body.title.trim();
      if (typeof body.width === 'number') project.width = body.width;
      if (typeof body.height === 'number') project.height = body.height;
      if (typeof body.orientation === 'string') project.orientation = body.orientation;
      if (typeof body.status === 'string') project.status = body.status;
      if (typeof body.visibility === 'string') project.visibility = body.visibility;
      if (typeof body.published === 'boolean') project.published = body.published;
      project.updatedAt = nowIso();
      saveDb(db);
      return { project };
    }
    if (rest[0] === 'duplicate' && method === 'POST') {
      const copy: StudioProject = {
        ...structuredClone(project),
        id: uid(),
        title: `${project.title} copia`,
        slug: slugify(`${project.title} copia`),
        published: false,
        visibility: 'private',
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db.projects.push(copy);
      saveDb(db);
      return { project: copy };
    }
    if (rest.length === 0 && method === 'DELETE') {
      db.projects = db.projects.filter((p) => p.id !== project.id);
      db.versions = db.versions.filter((v) => v.projectId !== project.id);
      db.assets = db.assets.filter((a) => a.projectId !== project.id);
      saveDb(db);
      return undefined;
    }
    if (rest[0] === 'document' && method === 'PATCH') {
      const body = await json();
      project.document = body.document as DocumentModel;
      project.updatedAt = nowIso();
      saveDb(db);
      return { project, savedAt: project.updatedAt };
    }
    if (rest[0] === 'versions' && rest.length === 1 && method === 'GET') {
      return {
        versions: db.versions
          .filter((v) => v.projectId === project.id)
          .sort((a, b) => b.versionNumber - a.versionNumber)
          .map((v) => ({
            id: v.id,
            versionNumber: v.versionNumber,
            label: v.label,
            createdAt: v.createdAt,
            user: { id: user.id, name: user.name },
          })),
      };
    }
    if (rest[0] === 'versions' && rest.length === 1 && method === 'POST') {
      const body = await json();
      const last = db.versions
        .filter((v) => v.projectId === project.id)
        .sort((a, b) => b.versionNumber - a.versionNumber)[0];
      const versionNumber = (last?.versionNumber ?? 0) + 1;
      const version: StudioVersion = {
        id: uid(),
        projectId: project.id,
        userId: user.id,
        versionNumber,
        label: String(body.label || `Versión ${versionNumber}`),
        createdAt: nowIso(),
        document: structuredClone(project.document),
      };
      db.versions.push(version);
      saveDb(db);
      return { version: { id: version.id, versionNumber, label: version.label, createdAt: version.createdAt } };
    }
    if (rest[0] === 'versions' && rest[1] && rest[2] === 'restore' && method === 'POST') {
      const version = db.versions.find((v) => v.id === rest[1] && v.projectId === project.id);
      if (!version) throw new StudioError('Versión no encontrada', 404);
      project.document = structuredClone(version.document);
      project.updatedAt = nowIso();
      const last = db.versions
        .filter((v) => v.projectId === project.id)
        .sort((a, b) => b.versionNumber - a.versionNumber)[0];
      const restored: StudioVersion = {
        id: uid(),
        projectId: project.id,
        userId: user.id,
        versionNumber: (last?.versionNumber ?? 0) + 1,
        label: `Restaurada desde v${version.versionNumber}`,
        createdAt: nowIso(),
        document: structuredClone(project.document),
      };
      db.versions.push(restored);
      saveDb(db);
      return {
        restoredFrom: version.versionNumber,
        newVersion: {
          id: restored.id,
          versionNumber: restored.versionNumber,
          label: restored.label,
          createdAt: restored.createdAt,
        },
        document: project.document,
      };
    }
    if (rest[0] === 'assets' && rest.length === 1 && method === 'GET') {
      return { assets: db.assets.filter((a) => a.projectId === project.id).map((a) => assetView(a, project)) };
    }
    if (rest[0] === 'assets' && rest.length === 1 && method === 'POST') {
      const body = init?.body;
      if (!(body instanceof FormData)) throw new StudioError('Archivo requerido', 400, 'FILE_REQUIRED');
      const file = body.get('file');
      if (!(file instanceof File)) throw new StudioError('Archivo requerido', 400, 'FILE_REQUIRED');
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new StudioError('No se pudo leer el archivo', 400));
        reader.readAsDataURL(file);
      });
      const asset: StudioAsset = {
        id: uid(),
        projectId: project.id,
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        createdAt: nowIso(),
        dataUrl,
      };
      db.assets.push(asset);
      saveDb(db);
      return { asset: assetView(asset, project) };
    }
    if (rest[0] === 'export' && rest[1] === 'pdf' && method === 'POST') {
      const row: StudioExport = {
        id: uid(),
        projectId: project.id,
        title: project.title,
        createdAt: nowIso(),
      };
      db.exports.push(row);
      saveDb(db);
      return { export: { id: row.id, status: 'ready' } };
    }
  }

  throw new StudioError('Ruta no encontrada', 404);
}

async function studioResponse(path: string, search: string, init?: RequestInit) {
  try {
    const data = await handle(path, search, init);
    if (data === undefined) return new Response(null, { status: 204 });
    if (data instanceof Blob) return new Response(data);
    if (typeof data === 'string' && data.startsWith('data:')) {
      const res = await origFetch(data);
      return res;
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const err = error instanceof StudioError ? error : new StudioError('Error de red', 500);
    return new Response(JSON.stringify({ error: err.message, code: err.code }), {
      status: err.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

const origFetch = typeof window !== 'undefined' ? window.fetch.bind(window) : fetch;

export function installPortfolioStudio() {
  if (!isPortfolioStudio() || typeof window === 'undefined') return;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    try {
      const url = new URL(raw, window.location.origin);
      if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
        const merged: RequestInit =
          input instanceof Request
            ? {
                method: input.method,
                headers: input.headers,
                body: ['GET', 'HEAD'].includes(input.method) ? undefined : input.body,
                ...init,
              }
            : { ...init };
        return studioResponse(url.pathname, url.search, merged);
      }
    } catch {
      /* native fetch */
    }
    return origFetch(input, init);
  };
}

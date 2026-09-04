import { prisma } from '../utils/prisma.js';
import { AppError, assertFound } from '../utils/errors.js';
import { slugify } from '../utils/slug.js';
import { createEmptyDocument, isDocumentModel } from '../types/document.js';
import { getTemplate } from './templateService.js';

function parseDocument(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function serializeProject(project: {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  width: number;
  height: number;
  orientation: string;
  status: string;
  visibility: string;
  published: boolean;
  documentJson: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: project.id,
    ownerId: project.ownerId,
    title: project.title,
    slug: project.slug,
    width: project.width,
    height: project.height,
    orientation: project.orientation,
    status: project.status,
    visibility: project.visibility,
    published: project.published,
    document: parseDocument(project.documentJson),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export class ProjectService {
  async listForUser(ownerId: string, status?: string) {
    const projects = await prisma.project.findMany({
      where: {
        ownerId,
        ...(status ? { status } : { status: { not: 'archived' } }),
      },
      orderBy: { updatedAt: 'desc' },
    });
    return projects.map(serializeProject);
  }

  async getOwned(projectId: string, ownerId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId },
    });
    return assertFound(project, 'Proyecto no encontrado');
  }

  async getByIdForOwner(projectId: string, ownerId: string) {
    return serializeProject(await this.getOwned(projectId, ownerId));
  }

  async create(
    ownerId: string,
    input: {
      title: string;
      width: number;
      height: number;
      orientation: 'portrait' | 'landscape';
      templateId?: string;
    },
  ) {
    let width = input.width;
    let height = input.height;
    let orientation = input.orientation;
    let document = createEmptyDocument(input.title, width, height);

    if (input.templateId) {
      const template = getTemplate(input.templateId);
      if (!template) {
        throw new AppError(400, 'Plantilla no encontrada', 'TEMPLATE_NOT_FOUND');
      }
      width = template.width;
      height = template.height;
      orientation = template.orientation;
      document = template.build();
      document.meta.title = input.title;
    }

    const project = await prisma.project.create({
      data: {
        ownerId,
        title: input.title,
        slug: slugify(input.title),
        width,
        height,
        orientation,
        documentJson: JSON.stringify(document),
      },
    });

    return serializeProject(project);
  }

  async update(
    projectId: string,
    ownerId: string,
    data: {
      title?: string;
      width?: number;
      height?: number;
      orientation?: 'portrait' | 'landscape';
      status?: 'active' | 'archived';
      visibility?: 'private' | 'public';
      published?: boolean;
    },
  ) {
    await this.getOwned(projectId, ownerId);

    if (data.published && data.visibility === undefined) {
      data.visibility = 'public';
    }
    if (data.published === true) {
      data.visibility = 'public';
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data,
    });
    return serializeProject(project);
  }

  async duplicate(projectId: string, ownerId: string) {
    const source = await this.getOwned(projectId, ownerId);
    const copy = await prisma.project.create({
      data: {
        ownerId,
        title: `${source.title} (copia)`,
        slug: slugify(`${source.title}-copia`),
        width: source.width,
        height: source.height,
        orientation: source.orientation,
        documentJson: source.documentJson,
        visibility: 'private',
        published: false,
      },
    });
    return serializeProject(copy);
  }

  async remove(projectId: string, ownerId: string) {
    await this.getOwned(projectId, ownerId);
    await prisma.project.delete({ where: { id: projectId } });
  }

  async saveDocument(projectId: string, ownerId: string, document: unknown) {
    if (!isDocumentModel(document)) {
      throw new AppError(400, 'Documento inválido', 'INVALID_DOCUMENT');
    }
    await this.getOwned(projectId, ownerId);
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        documentJson: JSON.stringify(document),
        width: document.meta.width,
        height: document.meta.height,
        title: document.meta.title || undefined,
      },
    });
    return serializeProject(project);
  }

  async getPublicBySlug(slug: string) {
    const project = await prisma.project.findFirst({
      where: {
        slug,
        published: true,
        visibility: 'public',
        status: 'active',
      },
      include: {
        owner: { select: { name: true } },
      },
    });
    const found = assertFound(project, 'Publicación no encontrada');
    return {
      ...serializeProject(found),
      authorName: found.owner.name,
    };
  }
}

export const projectService = new ProjectService();

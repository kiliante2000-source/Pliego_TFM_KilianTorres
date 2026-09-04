import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';
import { projectService } from './projectService.js';

export class VersionService {
  async list(projectId: string, ownerId: string) {
    await projectService.getOwned(projectId, ownerId);
    return prisma.projectVersion.findMany({
      where: { projectId },
      orderBy: { versionNumber: 'desc' },
      select: {
        id: true,
        versionNumber: true,
        label: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });
  }

  async create(projectId: string, ownerId: string, label?: string) {
    const project = await projectService.getOwned(projectId, ownerId);
    const last = await prisma.projectVersion.findFirst({
      where: { projectId },
      orderBy: { versionNumber: 'desc' },
    });
    const versionNumber = (last?.versionNumber ?? 0) + 1;

    return prisma.projectVersion.create({
      data: {
        projectId,
        userId: ownerId,
        versionNumber,
        label: label || `Versión ${versionNumber}`,
        documentJson: project.documentJson,
      },
      select: {
        id: true,
        versionNumber: true,
        label: true,
        createdAt: true,
      },
    });
  }

  async restore(projectId: string, ownerId: string, versionId: string) {
    await projectService.getOwned(projectId, ownerId);
    const version = await prisma.projectVersion.findFirst({
      where: { id: versionId, projectId },
    });
    if (!version) {
      throw new AppError(404, 'Versión no encontrada', 'VERSION_NOT_FOUND');
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { documentJson: version.documentJson },
    });

    const restored = await this.create(
      projectId,
      ownerId,
      `Restaurada desde v${version.versionNumber}`,
    );

    return {
      restoredFrom: version.versionNumber,
      newVersion: restored,
      document: JSON.parse(version.documentJson),
    };
  }
}

export const versionService = new VersionService();

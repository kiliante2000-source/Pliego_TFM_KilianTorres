import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth.js';
import { projectService } from '../services/projectService.js';
import { prisma } from '../utils/prisma.js';
import { assetService } from '../services/assetService.js';
import { AppError, assertFound } from '../utils/errors.js';

export class PublicController {
  getBySlug = async (req: AuthedRequest, res: Response) => {
    const project = await projectService.getPublicBySlug(String(req.params.slug));
    res.json({ project });
  };
}

export class AssetFileController {
  serve = async (req: AuthedRequest, res: Response) => {
    const asset = assertFound(
      await prisma.asset.findUnique({
        where: { id: String(req.params.id) },
        include: { project: true },
      }),
      'Recurso no encontrado',
    );

    const isOwner = req.user?.sub === asset.project.ownerId;
    const isPublic = asset.project.published && asset.project.visibility === 'public';
    if (!isOwner && !isPublic) {
      throw new AppError(403, 'Sin permiso', 'FORBIDDEN');
    }

    res.sendFile(assetService.resolvePath(asset.storageKey));
  };
}

export const publicController = new PublicController();
export const assetFileController = new AssetFileController();

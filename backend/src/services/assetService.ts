import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { prisma } from '../utils/prisma.js';
import { env } from '../utils/env.js';
import { AppError } from '../utils/errors.js';
import { projectService } from './projectService.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export class AssetService {
  async ensureDirs() {
    await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
    await fs.mkdir(env.EXPORT_DIR, { recursive: true });
  }

  async list(projectId: string, ownerId: string) {
    await projectService.getOwned(projectId, ownerId);
    return prisma.asset.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upload(
    projectId: string,
    ownerId: string,
    file: Express.Multer.File,
  ) {
    await projectService.getOwned(projectId, ownerId);

    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new AppError(400, 'Tipo de archivo no permitido', 'INVALID_MIME');
    }
    if (file.size > env.MAX_UPLOAD_BYTES) {
      throw new AppError(400, 'Archivo demasiado grande (máx. 5 MB)', 'FILE_TOO_LARGE');
    }

    await this.ensureDirs();
    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const storageKey = `${projectId}/${randomUUID()}${ext}`;
    const fullPath = path.join(env.UPLOAD_DIR, storageKey);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file.buffer);

    return prisma.asset.create({
      data: {
        projectId,
        filename: file.originalname.slice(0, 180),
        mimeType: file.mimetype,
        size: file.size,
        storageKey,
      },
    });
  }

  resolvePath(storageKey: string) {
    const resolved = path.resolve(env.UPLOAD_DIR, storageKey);
    const root = path.resolve(env.UPLOAD_DIR);
    if (!resolved.startsWith(root)) {
      throw new AppError(400, 'Ruta inválida', 'INVALID_PATH');
    }
    return resolved;
  }
}

export const assetService = new AssetService();

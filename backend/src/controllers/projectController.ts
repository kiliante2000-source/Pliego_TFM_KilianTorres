import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth.js';
import {
  createProjectSchema,
  updateProjectSchema,
  saveDocumentSchema,
  createVersionSchema,
} from '../validators/schemas.js';
import { projectService } from '../services/projectService.js';
import { versionService } from '../services/versionService.js';
import { assetService } from '../services/assetService.js';
import { exportService } from '../services/exportService.js';
import { templates } from '../services/templateService.js';
import { AppError } from '../utils/errors.js';

function requireUser(req: AuthedRequest) {
  if (!req.user) throw new AppError(401, 'No autenticado', 'UNAUTHORIZED');
  return req.user;
}

export class ProjectController {
  list = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const projects = await projectService.listForUser(user.sub, status);
    res.json({ projects });
  };

  templates = async (_req: AuthedRequest, res: Response) => {
    res.json({
      templates: templates.map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        width: t.width,
        height: t.height,
        orientation: t.orientation,
      })),
    });
  };

  get = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const project = await projectService.getByIdForOwner(String(req.params.id), user.sub);
    res.json({ project });
  };

  create = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const body = createProjectSchema.parse(req.body);
    const project = await projectService.create(user.sub, body);
    res.status(201).json({ project });
  };

  update = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const body = updateProjectSchema.parse(req.body);
    const project = await projectService.update(String(req.params.id), user.sub, body);
    res.json({ project });
  };

  duplicate = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const project = await projectService.duplicate(String(req.params.id), user.sub);
    res.status(201).json({ project });
  };

  remove = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    await projectService.remove(String(req.params.id), user.sub);
    res.status(204).send();
  };

  saveDocument = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const body = saveDocumentSchema.parse(req.body);
    const project = await projectService.saveDocument(String(req.params.id), user.sub, body.document);
    res.json({ project, savedAt: new Date().toISOString() });
  };

  listVersions = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const versions = await versionService.list(String(req.params.id), user.sub);
    res.json({ versions });
  };

  createVersion = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const body = createVersionSchema.parse(req.body ?? {});
    const version = await versionService.create(String(req.params.id), user.sub, body.label);
    res.status(201).json({ version });
  };

  restoreVersion = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const result = await versionService.restore(
      String(req.params.id),
      user.sub,
      String(req.params.versionId),
    );
    res.json(result);
  };

  listAssets = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const assets = await assetService.list(String(req.params.id), user.sub);
    res.json({ assets });
  };

  uploadAsset = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    if (!req.file) {
      throw new AppError(400, 'Archivo requerido', 'FILE_REQUIRED');
    }
    const asset = await assetService.upload(String(req.params.id), user.sub, req.file);
    res.status(201).json({
      asset: {
        ...asset,
        url: `/api/assets/${asset.id}/file`,
      },
    });
  };

  exportPdf = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const exportRow = await exportService.exportPdf(String(req.params.id), user.sub);
    res.status(201).json({ export: exportRow });
  };

  downloadExport = async (req: AuthedRequest, res: Response) => {
    const user = requireUser(req);
    const row = await exportService.getOwnedExport(String(req.params.exportId), user.sub);
    if (row.status !== 'ready' || !row.fileKey) {
      throw new AppError(409, 'La exportación aún no está lista', 'EXPORT_NOT_READY');
    }
    res.download(exportService.resolvePath(row.fileKey), `${row.projectId}.pdf`);
  };
}

export const projectController = new ProjectController();

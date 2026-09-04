import { Router } from 'express';
import multer from 'multer';
import { projectController } from '../controllers/projectController.js';
import { requireAuth } from '../middleware/auth.js';
import { env } from '../utils/env.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_BYTES },
});

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.get('/templates', projectController.templates);
projectRouter.get('/', projectController.list);
projectRouter.post('/', projectController.create);
projectRouter.get('/exports/:exportId/download', projectController.downloadExport);
projectRouter.get('/:id', projectController.get);
projectRouter.patch('/:id', projectController.update);
projectRouter.post('/:id/duplicate', projectController.duplicate);
projectRouter.delete('/:id', projectController.remove);
projectRouter.patch('/:id/document', projectController.saveDocument);

projectRouter.get('/:id/versions', projectController.listVersions);
projectRouter.post('/:id/versions', projectController.createVersion);
projectRouter.post('/:id/versions/:versionId/restore', projectController.restoreVersion);

projectRouter.get('/:id/assets', projectController.listAssets);
projectRouter.post('/:id/assets', upload.single('file'), projectController.uploadAsset);

projectRouter.post('/:id/export/pdf', projectController.exportPdf);

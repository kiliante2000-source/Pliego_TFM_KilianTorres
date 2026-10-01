import { Router } from 'express';
import { publicController, assetFileController } from '../controllers/publicController.js';
import { optionalAuth } from '../middleware/auth.js';

export const publicRouter = Router();
export const assetRouter = Router();

publicRouter.get('/:slug', publicController.getBySlug);
assetRouter.get('/:id/file', optionalAuth, assetFileController.serve);

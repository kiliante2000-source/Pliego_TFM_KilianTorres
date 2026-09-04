import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimitAuth } from '../middleware/rateLimit.js';

export const authRouter = Router();

authRouter.post('/register', rateLimitAuth, authController.register);
authRouter.post('/login', rateLimitAuth, authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', requireAuth, authController.me);
authRouter.patch('/me', requireAuth, authController.updateProfile);

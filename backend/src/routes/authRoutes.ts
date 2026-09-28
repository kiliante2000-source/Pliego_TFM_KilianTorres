import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { rateLimitLogin, rateLimitRegister } from '../middleware/rateLimit.js';

export const authRouter = Router();

authRouter.post('/register', rateLimitRegister, authController.register);
authRouter.post('/login', rateLimitLogin, authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', optionalAuth, authController.me);
authRouter.patch('/me', requireAuth, authController.updateProfile);

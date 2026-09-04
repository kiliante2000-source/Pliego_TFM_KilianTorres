import type { Response } from 'express';
import { env } from '../utils/env.js';
import { signToken } from '../utils/jwt.js';
import { userRepository } from '../repositories/userRepository.js';
import type { AuthedRequest } from '../middleware/auth.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/schemas.js';
import { AppError } from '../utils/errors.js';

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export class AuthController {
  register = async (req: AuthedRequest, res: Response) => {
    const body = registerSchema.parse(req.body);
    const user = await userRepository.create(body);
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);
    res.status(201).json({ user });
  };

  login = async (req: AuthedRequest, res: Response) => {
    const body = loginSchema.parse(req.body);
    const user = await userRepository.verifyCredentials(body.email, body.password);
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);
    res.json({ user });
  };

  logout = async (_req: AuthedRequest, res: Response) => {
    res.clearCookie(env.COOKIE_NAME, { path: '/' });
    res.json({ ok: true });
  };

  me = async (req: AuthedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'No autenticado', 'UNAUTHORIZED');
    }
    const user = await userRepository.findById(req.user.sub);
    if (!user) {
      throw new AppError(401, 'Usuario no encontrado', 'UNAUTHORIZED');
    }
    res.json({ user });
  };

  updateProfile = async (req: AuthedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError(401, 'No autenticado', 'UNAUTHORIZED');
    }
    const body = updateProfileSchema.parse(req.body);
    const user = await userRepository.updateProfile(req.user.sub, body);
    res.json({ user });
  };
}

export const authController = new AuthController();

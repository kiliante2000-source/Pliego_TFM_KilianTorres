import type { NextFunction, Request, Response } from 'express';
import { env } from '../utils/env.js';
import { AppError } from '../utils/errors.js';
import { verifyToken, type JwtPayload } from '../utils/jwt.js';

export type AuthedRequest = Request & {
  user?: JwtPayload;
};

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[env.COOKIE_NAME] as string | undefined;
    if (!token) {
      throw new AppError(401, 'No autenticado', 'UNAUTHORIZED');
    }
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, 'Sesión inválida o expirada', 'UNAUTHORIZED'));
  }
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[env.COOKIE_NAME] as string | undefined;
    if (token) {
      req.user = verifyToken(token);
    }
  } catch {
    // ignore invalid token for optional routes
  }
  next();
}

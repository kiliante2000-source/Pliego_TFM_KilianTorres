import type { NextFunction, Request, Response } from 'express';
import { env } from '../utils/env.js';
import { AppError } from '../utils/errors.js';
import { verifyToken, type JwtPayload } from '../utils/jwt.js';

export type AuthedRequest = Request & {
  user?: JwtPayload;
};

function readAccessToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7).trim() || undefined;
  }
  const cookie = req.cookies?.[env.COOKIE_NAME];
  return typeof cookie === 'string' && cookie ? cookie : undefined;
}

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const token = readAccessToken(req);
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
    const token = readAccessToken(req);
    if (token) {
      req.user = verifyToken(token);
    }
  } catch {
    // ignore invalid token for optional routes
  }
  next();
}

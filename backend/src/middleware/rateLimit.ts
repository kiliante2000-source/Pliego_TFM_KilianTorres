import type { NextFunction, Request, Response } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AppError } from '../utils/errors.js';

const authLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
});

export async function rateLimitAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const key = req.ip || 'unknown';
    await authLimiter.consume(key);
    next();
  } catch {
    next(new AppError(429, 'Demasiados intentos. Espera un momento.', 'RATE_LIMITED'));
  }
}

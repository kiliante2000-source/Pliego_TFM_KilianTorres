import type { NextFunction, Request, Response } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AppError } from '../utils/errors.js';

/** Login: more permissive for normal use, still blocks brute force. */
const loginLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60,
  blockDuration: 60,
});

/** Register: stricter to avoid account spam. */
const registerLimiter = new RateLimiterMemory({
  points: 8,
  duration: 60,
  blockDuration: 120,
});

/** Generic API bursts per IP for authenticated mutations. */
const apiLimiter = new RateLimiterMemory({
  points: 120,
  duration: 60,
});

function clientKey(req: Request) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

async function consume(
  limiter: RateLimiterMemory,
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    await limiter.consume(clientKey(req));
    next();
  } catch {
    next(new AppError(429, 'Demasiados intentos. Espera un momento.', 'RATE_LIMITED'));
  }
}

export function rateLimitLogin(req: Request, res: Response, next: NextFunction) {
  return consume(loginLimiter, req, res, next);
}

export function rateLimitRegister(req: Request, res: Response, next: NextFunction) {
  return consume(registerLimiter, req, res, next);
}

/** @deprecated use rateLimitLogin / rateLimitRegister */
export function rateLimitAuth(req: Request, res: Response, next: NextFunction) {
  return consume(loginLimiter, req, res, next);
}

export function rateLimitApi(req: Request, res: Response, next: NextFunction) {
  return consume(apiLimiter, req, res, next);
}

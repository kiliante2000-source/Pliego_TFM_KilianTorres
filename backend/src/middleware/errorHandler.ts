import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err instanceof ZodError) {
    const first = err.issues[0]?.message;
    return res.status(400).json({
      error: first || 'Datos inválidos',
      code: 'VALIDATION_ERROR',
      details: err.flatten(),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe un registro con esos datos',
        code: 'UNIQUE_CONSTRAINT',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Recurso no encontrado',
        code: 'NOT_FOUND',
      });
    }
  }

  console.error(err);
  return res.status(500).json({
    error: 'Error interno del servidor',
    code: 'INTERNAL_ERROR',
  });
}

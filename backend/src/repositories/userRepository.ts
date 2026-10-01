import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';

const USER_PUBLIC = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: USER_PUBLIC,
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    const email = normalizeEmail(data.email);
    const name = data.name.trim();
    const passwordHash = await bcrypt.hash(data.password, 12);

    try {
      return await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          status: 'active',
        },
        select: USER_PUBLIC,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new AppError(409, 'Ya existe una cuenta con ese email', 'EMAIL_TAKEN');
      }
      throw err;
    }
  }

  async verifyCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user || user.status === 'deleted') {
      throw new AppError(401, 'Email o contraseña incorrectos', 'INVALID_CREDENTIALS');
    }
    if (user.status === 'suspended') {
      throw new AppError(403, 'Esta cuenta está suspendida. Contacta con soporte.', 'ACCOUNT_SUSPENDED');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'Email o contraseña incorrectos', 'INVALID_CREDENTIALS');
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
      select: USER_PUBLIC,
    });

    return updated;
  }

  updateProfile(id: string, data: { name?: string }) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      },
      select: USER_PUBLIC,
    });
  }
}

export const userRepository = new UserRepository();

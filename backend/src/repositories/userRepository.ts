import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, 'Ya existe una cuenta con ese email', 'EMAIL_TAKEN');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async verifyCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Email o contraseña incorrectos', 'INVALID_CREDENTIALS');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'Email o contraseña incorrectos', 'INVALID_CREDENTIALS');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  updateProfile(id: string, data: { name?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }
}

export const userRepository = new UserRepository();

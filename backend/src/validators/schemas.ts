import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
});

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  width: z.number().int().min(200).max(5000).default(1080),
  height: z.number().int().min(200).max(5000).default(1350),
  orientation: z.enum(['portrait', 'landscape']).default('portrait'),
  templateId: z.string().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  width: z.number().int().min(200).max(5000).optional(),
  height: z.number().int().min(200).max(5000).optional(),
  orientation: z.enum(['portrait', 'landscape']).optional(),
  status: z.enum(['active', 'archived']).optional(),
  visibility: z.enum(['private', 'public']).optional(),
  published: z.boolean().optional(),
});

export const saveDocumentSchema = z.object({
  document: z.unknown(),
});

export const createVersionSchema = z.object({
  label: z.string().trim().max(120).optional(),
});

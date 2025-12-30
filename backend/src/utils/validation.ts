import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  email: z.string().email('Invalid email address').optional().nullable(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Brute validation schemas
export const createBruteSchema = z.object({
  name: z.string()
    .min(2, 'Brute name must be at least 2 characters')
    .max(50, 'Brute name must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_\s-]+$/, 'Brute name can only contain letters, numbers, spaces, underscores and hyphens'),
  skillIds: z.array(z.number().int().positive()).max(3, 'Maximum 3 skills allowed').optional(),
  appearance: z.object({
    gender: z.enum(['male', 'female']).optional(),
    bodyType: z.number().int().min(0).max(10).optional(),
    headType: z.number().int().min(0).max(10).optional(),
    hairType: z.number().int().min(0).max(20).optional(),
    hairColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    skinColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    clothingColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional(),
});

export const updateBruteSchema = z.object({
  skillIds: z.array(z.number().int().positive()).max(3).optional(),
  appearance: z.object({
    hairColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    clothingColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional(),
});

// Fight validation schemas
export const startFightSchema = z.object({
  attackerId: z.number().int().positive('Attacker ID is required'),
  defenderId: z.number().int().positive('Defender ID is required'),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Generic ID param schema
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Export types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBruteInput = z.infer<typeof createBruteSchema>;
export type UpdateBruteInput = z.infer<typeof updateBruteSchema>;
export type StartFightInput = z.infer<typeof startFightSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;


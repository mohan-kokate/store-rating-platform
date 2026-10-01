import { z } from 'zod';

const email = z.string().trim().email();
const password = z.string().min(8).max(16).regex(/[A-Z]/, 'Password must include at least one uppercase letter').regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');
const name = z.string().trim().min(20).max(60);
const address = z.string().trim().max(400);

export const registerSchema = z.object({ name, email, address, password });
export const adminUserSchema = z.object({ name, email, address, password, role: z.enum(['ADMIN','USER','OWNER']) });
export const storeSchema = z.object({ name: z.string().trim().min(2).max(120), email, address, ownerId: z.number().int().positive().nullable().optional() });
export const passwordSchema = z.object({ password });
export const ratingSchema = z.object({ storeId: z.number().int().positive(), rating: z.number().int().min(1).max(5) });

export function parse(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map(i => `${i.path.join('.') || 'field'}: ${i.message}`).join('; ');
    const error = new Error(message); error.status = 400; throw error;
  }
  return result.data;
}

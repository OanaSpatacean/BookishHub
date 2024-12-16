import { z } from 'zod'

export const createUserSchema = z.object(
{
    name: z.string().optional(),
    email: z.string().email(),
    image: z.string().optional(),
    points: z.number().optional(),
    isAdmin: z.boolean().optional()
}
);

export const updateUserSchema = z.object(
{
    id: z.string(),
    name: z.string().optional(),
    points: z.number().optional(),
    isAdmin: z.boolean().optional()
}
);

export const deleteUserSchema = z.object(
{
    id: z.string()
}
);
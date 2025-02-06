import { z } from 'zod'

export const createUserSchema = z.object(
{
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().optional(),
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

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const updateAccountInfoSchema = z.object(
{
    id: z.string(),
    name: z.string().optional(),
    password: z.string().optional(),
}
);
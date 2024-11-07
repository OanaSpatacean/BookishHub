import { z } from 'zod'

export const generateTopicsSchema = z.object(
{
    name: z.string().min(3).max(99),
    modules: z.array(z.string())
}
);
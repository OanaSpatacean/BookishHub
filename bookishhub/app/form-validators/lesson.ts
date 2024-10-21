import { z } from 'zod'

export const generateTopicsSchema = z.object(
{
    modules: z.array(z.string()),
    name: z.string().min(4).max(99),
}
);
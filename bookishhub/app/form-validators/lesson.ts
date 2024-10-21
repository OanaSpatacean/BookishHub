import { z } from 'zod'

export const generateTopicsSchema = z.object(
{
    units: z.array(z.string()),
    title: z.string().min(4).max(99),
}
);
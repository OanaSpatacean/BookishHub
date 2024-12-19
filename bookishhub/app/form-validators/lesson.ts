import { z } from 'zod'

export const designTopicsSchema = z.object(
{
    name: z.string().min(1).max(99),
    modules: z.array(z.string())
}
);

export const deleteLessonSchema = z.object(
{
    id: z.string()
}
);

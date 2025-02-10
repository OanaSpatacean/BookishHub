import { z } from 'zod'

export const deletePDFFileSchema = z.object(
{
    id: z.string()
}
)

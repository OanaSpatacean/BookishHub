import { z } from 'zod'

export const deletePDFConversationSchema = z.object(
{
    id: z.string()
}
)

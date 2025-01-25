import { z } from 'zod'

export const PDFRequestSchema = z.object({
  id: z.number().int(),
  aboutPDFConversationId: z.number().int(),
  content: z.string(),
  createdAt: z.string().datetime(),
  role: z.enum(['SYSTEM', 'USER'])
})
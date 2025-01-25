import { z } from 'zod'

export const PDFRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "system"]),
      content: z.string(),
    })
  ),
  aboutPDFConversationId: z.number(),
})
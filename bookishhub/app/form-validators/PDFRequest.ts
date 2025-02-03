import { z } from 'zod'

export const PDFRequestSchema = z.object({
  PDFRequestId: z.number(),
  aboutPDFConversationId: z.number(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "system", "assistant"]), 
      content: z.string(),
    })
  )
})
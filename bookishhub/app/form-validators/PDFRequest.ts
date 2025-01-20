import { z } from 'zod'

export const PDFRequestSchema = z.object({
    aboutPDFConversationId: z.number(),
    PDFRequests: z.array(
      z.object({
        content: z.string().min(1).max(5000),
        role: z.enum(["SYSTEM", "USER"]),
      })
    )
})
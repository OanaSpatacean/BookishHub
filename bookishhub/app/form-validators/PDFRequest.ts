import { z } from 'zod'

export const PDFRequestSchema = z.object({
  fileId: z.number(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "system", "assistant"]),
      content: z.string().min(1, "Content cannot be empty"),
    })
  )
})
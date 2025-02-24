import { z } from "zod";

export const textWritingSchemaUpdate = z.object({
    textId: z.string().min(1, "textId is required"),
    textState: z.string().min(1, "textState cannot be empty")
})

export const textWritingSchemaCreate = z.object({
    name: z.string().min(1),
    textState: z.string().min(1, "textState cannot be empty")
})



import { z } from "zod";

export const textWritingSchemaUpdate = z.object({
    textId: z.string().min(1, "textId is required"),
    textState: z.string().min(1, "textState cannot be empty")
})

export const createWritingSchema = z.object({
    languageId: z.string().min(1, "Language ID is required"),
    languageSessionId: z.string().min(1, "Language session ID is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"], {
        errorMap: () => ({ message: "Invalid level selection" })
    })
})

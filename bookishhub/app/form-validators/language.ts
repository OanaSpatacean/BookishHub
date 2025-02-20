import { z } from "zod";

export const createLanguageAssessmentSchema = z.object({
    languageId: z.string().min(1, "Language ID is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"], {
        errorMap: () => ({ message: "Invalid level selection" })
    })
})

export const createRephrasingSchema = z.object({
    languageId: z.string().min(1, "Language ID is required"),
    languageSessionId: z.string().min(1, "Language session ID is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"], {
        errorMap: () => ({ message: "Invalid level selection" })
    })
})

import { z } from "zod";

export const createLanguageAssessmentSchema = z.object({
    languageId: z.string().min(1, "Language ID is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"], {
        errorMap: () => ({ message: "Invalid level selection" })
    })
})

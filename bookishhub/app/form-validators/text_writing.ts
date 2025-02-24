import { z } from "zod";

export const textWritingSchema = z.object({
    textId: z.string().min(1, "textId is required"),
    editorState: z.string().min(1, "editorState cannot be empty")
})

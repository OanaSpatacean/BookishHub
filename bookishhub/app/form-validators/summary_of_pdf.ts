import { z } from "zod";

export const SummaryOfPDFSchema = z.object({
    fileId: z.string()
  });
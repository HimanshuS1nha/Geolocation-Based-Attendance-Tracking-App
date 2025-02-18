import { z } from "zod";

export const editCompanyProfileValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" }),
  fileName: z.string().optional(),
  fileBase64: z.string().optional(),
});

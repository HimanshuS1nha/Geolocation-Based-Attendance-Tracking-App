import { z } from "zod";

export const editEmployeeValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  fileName: z.string({ required_error: "File name is required" }).optional(),
  fileBase64: z.string({ required_error: "File is required" }).optional(),
  designation: z
    .string({ required_error: "Designation is required" })
    .trim()
    .min(1, { message: "Designation is required" }),
});

import { z } from "zod";

export const signupValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be atleast 8 characters long" }),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .trim()
    .min(8, { message: "Confirm Password must be atleast 8 characters long" }),
  fileName: z
    .string({ required_error: "File name is required" })
    .trim()
    .min(1, { message: "File name is required" }),
  fileBase64: z
    .string({ required_error: "File is required" })
    .trim()
    .min(1, { message: "File is required" }),
});

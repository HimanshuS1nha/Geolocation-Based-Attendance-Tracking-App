import { z } from "zod";

export const changePasswordValidator = z.object({
  oldPassword: z
    .string({ required_error: "Old Password is required" })
    .trim()
    .min(8, { message: "Old Password must be atleast 8 characters long" }),
  newPassword: z
    .string({ required_error: "New Password is required" })
    .trim()
    .min(8, { message: "New Password must be atleast 8 characters long" }),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .trim()
    .min(8, { message: "Confirm Password must be atleast 8 characters long" }),
});

import { z } from "zod";

export const getEmployeesValidator = z.object({
  skip: z
    .number({ required_error: "Invalid request" })
    .gte(0, { message: "Skip value cannot be negative" }),
  designation: z.string(),
});

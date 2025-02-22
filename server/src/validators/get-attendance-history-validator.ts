import { z } from "zod";

export const getAttendanceHistoryValidator = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
});

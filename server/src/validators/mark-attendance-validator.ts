import { z } from "zod";

export const markAttendanceValidator = z.object({
  qrCodeToken: z
    .string({ required_error: "Invalid request" })
    .trim()
    .min(1, { message: "Invalid request" }),
  latitude: z.number({ required_error: "Latitude is required" }),
  longitude: z.number({ required_error: "Longitude is required" }),
});

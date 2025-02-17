import { Router } from "express";
import { ZodError } from "zod";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { createAndSendOtp } from "../helpers/create-and-send-otp";
import { getEmployeeByEmail } from "../helpers/get-employee-by-email";

import { emailValidator } from "../validators/email-validator";

const resendOtpRouter = Router();

resendOtpRouter.post("/company", async (req, res) => {
  try {
    const { email } = await emailValidator.parseAsync(req.body);

    const company = await getCompanyByEmail(email);
    if (!company) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await createAndSendOtp(email, "company");

    res.status(201).json({ message: "OTP resent successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({ error: error.errors[0].message });
    } else {
      res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

resendOtpRouter.post("/employee", async (req, res) => {
  try {
    const { email } = await emailValidator.parseAsync(req.body);

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await createAndSendOtp(email, "employee");

    res.status(201).json({ message: "OTP resent successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({ error: error.errors[0].message });
    } else {
      res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { resendOtpRouter };

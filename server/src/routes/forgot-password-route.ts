import { Router } from "express";
import { ZodError } from "zod";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { createAndSendOtp } from "../helpers/create-and-send-otp";
import { getEmployeeByEmail } from "../helpers/get-employee-by-email";

import { emailValidator } from "../validators/email-validator";

const forgotPasswordRouter = Router();

forgotPasswordRouter.post("/company", async (req, res) => {
  try {
    const { email } = await emailValidator.parseAsync(req.body);

    const company = await getCompanyByEmail(email);
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    await createAndSendOtp(email, "company");

    res.status(200).json({ message: "Verify your email" });
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

forgotPasswordRouter.post("/employee", async (req, res) => {
  try {
    const { email } = await emailValidator.parseAsync(req.body);

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }

    await createAndSendOtp(email, "employee");

    res.status(200).json({ message: "Verify your email" });
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

export { forgotPasswordRouter };

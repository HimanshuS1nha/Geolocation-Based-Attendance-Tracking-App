import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { createAndSendOtp } from "../helpers/create-and-send-otp";
import { getEmployeeByEmail } from "../helpers/get-employee-by-email";

import { emailValidator } from "../validators/email-validator";
import { verifyOtpValidator } from "../validators/verify-otp-validator";

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

forgotPasswordRouter.post("/verify-otp/company", async (req, res) => {
  try {
    const { email, otp } = await verifyOtpValidator.parseAsync(req.body);

    const company = await getCompanyByEmail(email);
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    const otpEntry = await prisma.companyOtp.findUnique({
      where: {
        companyEmail: company.email,
        otp: parseInt(otp),
      },
    });
    if (!otpEntry) {
      res.status(422).json({ error: "OTP does not exist" });
      return;
    }

    if (otpEntry.expires < new Date()) {
      res.status(409).json({ error: "OTP has expired" });
      return;
    }
    if (otpEntry.otp !== parseInt(otp)) {
      res.status(422).json({ error: "Invalid OTP" });
      return;
    }

    await prisma.companyOtp.deleteMany({
      where: {
        companyEmail: company.email,
      },
    });

    const token = jwt.sign(
      { email: company.email, type: "company" },
      process.env.JWT_SECRET!
    );

    res.status(200).json({ message: "OTP verified successfully", token });
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

forgotPasswordRouter.post("/verify-otp/company", async (req, res) => {
  try {
    const { email, otp } = await verifyOtpValidator.parseAsync(req.body);

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }

    const otpEntry = await prisma.employeeOtp.findUnique({
      where: {
        employeeEmail: employee.email,
        otp: parseInt(otp),
      },
    });
    if (!otpEntry) {
      res.status(422).json({ error: "OTP does not exist" });
      return;
    }

    if (otpEntry.expires < new Date()) {
      res.status(409).json({ error: "OTP has expired" });
      return;
    }
    if (otpEntry.otp !== parseInt(otp)) {
      res.status(422).json({ error: "Invalid OTP" });
      return;
    }

    await prisma.employeeOtp.deleteMany({
      where: {
        employeeEmail: employee.email,
      },
    });

    const token = jwt.sign(
      { email: employee.email, type: "employee" },
      process.env.JWT_SECRET!
    );

    res.status(200).json({ message: "OTP verified successfully", token });
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

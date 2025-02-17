import { Router } from "express";
import { ZodError } from "zod";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";

import { verifyOtpValidator } from "../validators/verify-otp-validator";

const verifyOtpRouter = Router();

verifyOtpRouter.post("/company", async (req, res) => {
  try {
    const { email, otp } = await verifyOtpValidator.parseAsync(req.body);

    const company = await getCompanyByEmail(email);
    if (!company) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const otpEntry = await prisma.companyOtp.findUnique({
      where: {
        companyEmail: email,
        otp: parseInt(otp),
      },
    });
    if (!otpEntry) {
      res.status(422).json({ error: "OTP does not exist" });
      return;
    }
    if (otpEntry.expires > new Date()) {
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

    await prisma.companies.update({
      where: {
        id: company.id,
      },
      data: {
        emailVerifiedAt: new Date(),
      },
    });

    res.status(200).json({ message: "Email verified successfully" });
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

export { verifyOtpRouter };

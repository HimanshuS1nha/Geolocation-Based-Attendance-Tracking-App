import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";

import { createNewPasswordValidator } from "../validators/create-new-password-validator";

const createNewPasswordRouter = Router();

createNewPasswordRouter.post("/company", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { email, type } = jwt.verify(
      token,
      process.env.JWT_PASSWORD_RESET_SECRET!
    ) as {
      email: string;
      type: "company";
    };
    if (type !== "company" || !email) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const company = await getCompanyByEmail(email);
    if (!company) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { confirmPassword, newPassword } =
      await createNewPasswordValidator.parseAsync(req.body);
    if (confirmPassword !== newPassword) {
      res.status(409).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.companies.update({
      where: {
        email: company.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
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

export { createNewPasswordRouter };

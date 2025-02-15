import { Router } from "express";
import { ZodError } from "zod";
import { hash } from "bcrypt";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { saveImage } from "../helpers/save-image";

import { signupValidator } from "../validators/signup-validator";

const signupRouter = Router();

signupRouter.post("/", async (req, res) => {
  try {
    const { confirmPassword, email, fileBase64, fileName, name, password } =
      await signupValidator.parseAsync(req.body);

    if (confirmPassword !== password) {
      res.status(409).json({ error: "Passwords do not match" });
      return;
    }

    const company = await getCompanyByEmail(email);
    if (company) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const newFilename = await saveImage(
      fileName,
      fileBase64,
      "uploads/companies"
    );

    const hashedPassword = await hash(password, 10);

    await prisma.companies.create({
      data: {
        name,
        email,
        image: `${process.env.URL}/uploads/companies/${newFilename}`,
        password: hashedPassword,
      },
    });

    //! SEND OTP VIA EMAIL

    res
      .status(200)
      .json({ message: "Account created successfully. Verify your email now" });
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

export { signupRouter };

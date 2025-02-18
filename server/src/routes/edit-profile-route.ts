import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { saveImage } from "../helpers/save-image";

import { editCompanyProfileValidator } from "../validators/edit-profile-validator";

const editProfileRouter = Router();

editProfileRouter.post("/company", async (req, res) => {
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

    const { email, type } = jwt.verify(token, process.env.JWT_SECRET!) as {
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

    const { fileName, name, fileBase64 } =
      await editCompanyProfileValidator.parseAsync(req.body);

    if (
      fileName &&
      fileName?.trim().length !== 0 &&
      fileBase64 &&
      fileBase64?.trim().length !== 0
    ) {
      const newFileName = await saveImage(
        fileName,
        fileBase64,
        "uploads/companies"
      );

      await prisma.companies.update({
        where: {
          id: company.id,
        },
        data: {
          name,
          image: `${process.env.URL}/uploads/companies/${newFileName}`,
        },
      });
    } else {
      await prisma.companies.update({
        where: {
          id: company.id,
        },
        data: {
          name,
        },
      });
    }

    res.status(200).json({ message: "Profile edited successfully" });
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

export { editProfileRouter };

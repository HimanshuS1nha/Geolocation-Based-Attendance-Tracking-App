import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";

import { addOfficeLocatioValidator } from "../validators/add-office-location-validator";

const addOfficeLocationRouter = Router();

addOfficeLocationRouter.post("/", async (req, res) => {
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

    const { latitude, longitude } = await addOfficeLocatioValidator.parseAsync(
      req.body
    );

    await prisma.companies.update({
      where: {
        id: company.id,
      },
      data: {
        officeLatitude: latitude,
        officeLongitude: longitude,
      },
    });

    res.status(200).json({ message: "Office location added successfully" });
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

export { addOfficeLocationRouter };

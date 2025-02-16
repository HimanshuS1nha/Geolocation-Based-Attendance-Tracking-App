import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { getEmployeeByEmail } from "../helpers/get-employee-by-email";

import { addEmployeeValidator } from "../validators/add-employee-validator";
import { saveImage } from "../helpers/save-image";

const addEmployeeRouter = Router();

addEmployeeRouter.post("/", async (req, res) => {
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

    const { email: companyEmail, type } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      email: string;
      type: "company";
    };
    if (type !== "company" || !companyEmail) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const company = await getCompanyByEmail(companyEmail);
    if (!company) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const {
      confirmPassword,
      designation,
      email,
      fileBase64,
      fileName,
      name,
      password,
    } = await addEmployeeValidator.parseAsync(req.body);
    if (password !== confirmPassword) {
      res.status(409).json({ error: "Passwords do not match" });
      return;
    }

    const employee = await getEmployeeByEmail(email);
    if (employee) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    const newFilename = await saveImage(
      fileName,
      fileBase64,
      "uploads/employees"
    );

    const hashedPassword = await hash(password, 10);

    await prisma.employees.create({
      data: {
        name,
        designation,
        password: hashedPassword,
        image: `${process.env.URL}/uploads/employees/${newFilename}`,
        companyEmail,
        email,
      },
    });

    res.status(201).json({ message: "Employee added successfully" });
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

export { addEmployeeRouter };

import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";

import { getEmployeesValidator } from "../validators/get-employees-validator";

const getEmployeesRouter = Router();

getEmployeesRouter.post("/", async (req, res) => {
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

    const { skip, designation } = await getEmployeesValidator.parseAsync(
      req.body
    );

    let employees;

    if (designation.length > 0) {
      employees = await prisma.employees.findMany({
        where: {
          companyEmail: company.email,
          designation,
        },
        skip,
        take: 20,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          designation: true,
        },
      });
    } else {
      employees = await prisma.employees.findMany({
        where: {
          companyEmail: company.email,
        },
        skip,
        take: 20,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          designation: true,
        },
      });
    }

    res.status(200).json({ employees });
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

export { getEmployeesRouter };

import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { getEmployeeByEmail } from "../helpers/get-employee-by-email";
import { saveImage } from "../helpers/save-image";

import { editEmployeeValidator } from "../validators/edit-employee-validator";

const editEmployeeRouter = Router();

editEmployeeRouter.post("/:employeeId", async (req, res) => {
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

    const employeeId = req.params.employeeId;
    const { designation, email, fileBase64, fileName, name } =
      await editEmployeeValidator.parseAsync(req.body);

    const employee = await prisma.employees.findUnique({
      where: {
        id: employeeId,
        companyEmail: company.email,
      },
    });
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }

    const doesEmailAlreadyExist = !!(await getEmployeeByEmail(email));
    if (doesEmailAlreadyExist) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    if (
      fileName &&
      fileName.trim().length !== 0 &&
      fileBase64 &&
      fileBase64.trim().length !== 0
    ) {
      const newFilename = await saveImage(
        fileName,
        fileBase64,
        "uploads/employees"
      );

      await prisma.employees.update({
        where: {
          id: employee.id,
        },
        data: {
          name,
          designation,
          email,
          image: `${process.env.URL}/uploads/employees/${newFilename}`,
        },
      });
    } else {
      await prisma.employees.update({
        where: {
          id: employee.id,
        },
        data: {
          name,
          designation,
          email,
        },
      });
    }

    res.status(200).json({ message: "Employee edited successfully" });
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

export { editEmployeeRouter };

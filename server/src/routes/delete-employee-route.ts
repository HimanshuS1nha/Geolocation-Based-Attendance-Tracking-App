import { Router } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";

const deleteEmployeeRouter = Router();

deleteEmployeeRouter.delete("/:employeeId", async (req, res) => {
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

    const employeeId = req.params.employeeId;

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

    await prisma.employees.delete({
      where: {
        id: employee.id,
      },
    });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { deleteEmployeeRouter };

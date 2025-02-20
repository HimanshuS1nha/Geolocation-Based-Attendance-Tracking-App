import { Router } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";

const getDesignationsRouter = Router();

getDesignationsRouter.get("/", async (req, res) => {
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

    const employees = await prisma.employees.findMany({
      where: {
        companyEmail: company.email,
      },
      select: {
        designation: true,
      },
    });

    const allDesignations = employees.map((employee) => employee.designation);
    const designationsSet = new Set(allDesignations);
    const uniqueDesignations = Array.from(designationsSet);

    res.status(200).json({ designations: uniqueDesignations });
  } catch {
    res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getDesignationsRouter };

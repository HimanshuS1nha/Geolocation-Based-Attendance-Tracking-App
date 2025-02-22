import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { getEmployeeByEmail } from "../helpers/get-employee-by-email";

import { getAttendanceHistoryValidator } from "../validators/get-attendance-history-validator";

const getAttendanceHistoryRouter = Router();

getAttendanceHistoryRouter.post("/company", async (req, res) => {
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

    const { skip, take } = await getAttendanceHistoryValidator.parseAsync(
      req.body
    );

    const totalNumberOfEmployees = await prisma.employees.count({
      where: {
        companyEmail: company.email,
      },
    });

    const attendanceRecords: {
      date: string;
      total: number;
      present: number;
      day: number;
    }[] = [];
    const numberOfEntriesToTake = take ?? 20;
    const numberOfEntriesToSkip = skip ?? 0;

    for (let i = 0; i <= numberOfEntriesToTake; i++) {
      const currentDate = new Date();
      currentDate.setDate(new Date().getDate() - (numberOfEntriesToSkip + i));

      const numberOfPresentEmployees = await prisma.employeeEntry.count({
        where: {
          attendance: {
            date: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            companyEmail: company.email,
          },
        },
      });

      attendanceRecords.push({
        present: numberOfPresentEmployees,
        total: totalNumberOfEmployees,
        date: `${String(currentDate.getDate()).padStart(2, "0")}/${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}/${currentDate.getFullYear()}`,
        day: currentDate.getDay(),
      });
    }

    res.status(200).json({ attendanceRecords });
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

getAttendanceHistoryRouter.post("/employee", async (req, res) => {
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
      type: "employee";
    };
    if (type !== "employee" || !email) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { skip, take } = await getAttendanceHistoryValidator.parseAsync(
      req.body
    );

    const attendanceRecords: {
      date: string;
      day: number;
      present: boolean;
    }[] = [];
    const numberOfEntriesToTake = take ?? 20;
    const numberOfEntriesToSkip = skip ?? 0;

    for (let i = 0; i < numberOfEntriesToTake; i++) {
      const currentDate = new Date();
      currentDate.setDate(new Date().getDate() - (numberOfEntriesToSkip + i));

      const employeeEntries = await prisma.employeeEntry.findMany({
        where: {
          attendance: {
            date: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
          },
        },
      });

      attendanceRecords.push({
        present: employeeEntries.length > 0,
        date: `${String(currentDate.getDate()).padStart(2, "0")}/${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}/${currentDate.getFullYear()}`,
        day: currentDate.getDay(),
      });
    }

    res.status(200).json({ attendanceRecords });
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

export { getAttendanceHistoryRouter };

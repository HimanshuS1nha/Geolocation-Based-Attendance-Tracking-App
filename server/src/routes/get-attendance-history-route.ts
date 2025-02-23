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

    for (let i = 0; i < numberOfEntriesToTake; i++) {
      const currentDate = new Date();
      currentDate.setDate(new Date().getDate() - (numberOfEntriesToSkip + i));

      const attendance = await prisma.attendance.findMany({
        where: {
          date: currentDate.getDate(),
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
          companyEmail: company.email,
        },
      });
      if (attendance.length === 0) {
        continue;
      }

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

getAttendanceHistoryRouter.post("/company/:employeeId", async (req, res) => {
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

    const { employeeId } = req.params;
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

    const { skip, take } = await getAttendanceHistoryValidator.parseAsync(
      req.body
    );

    const attendanceRecords: {
      date: string;
      timeSpent: string;
      isPresent: boolean;
      day: number;
    }[] = [];
    const numberOfEntriesToTake = take ?? 20;
    const numberOfEntriesToSkip = skip ?? 0;

    for (let i = 0; i < numberOfEntriesToTake; i++) {
      const currentDate = new Date();
      currentDate.setDate(new Date().getDate() - (numberOfEntriesToSkip + i));

      const attendance = await prisma.attendance.findMany({
        where: {
          date: currentDate.getDate(),
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
          employeeEmail: employee.email,
        },
      });
      if (attendance.length === 0) {
        continue;
      }

      const employeeEntries = await prisma.employeeEntry.findMany({
        where: {
          attendance: {
            date: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            employeeEmail: employee.email,
          },
        },
        select: {
          EmployeeExit: {
            select: {
              exitedAt: true,
            },
          },
          enteredAt: true,
        },
      });

      let timeSpentInSeconds = 0;

      for (const employeeEntry of employeeEntries) {
        if (employeeEntry.enteredAt && employeeEntry.EmployeeExit?.exitedAt) {
          timeSpentInSeconds +=
            (employeeEntry.EmployeeExit.exitedAt.getTime() -
              employeeEntry.enteredAt.getTime()) /
            1000;
        }
      }

      attendanceRecords.push({
        timeSpent: `${String(Math.floor(timeSpentInSeconds / 3600)).padStart(
          2,
          "0"
        )}:${String(Math.floor((timeSpentInSeconds % 3600) / 60)).padStart(
          2,
          "0"
        )}`,
        date: `${String(currentDate.getDate()).padStart(2, "0")}/${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}/${currentDate.getFullYear()}`,
        day: currentDate.getDay(),
        isPresent: employeeEntries.length > 0,
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

getAttendanceHistoryRouter.post("/company/date", async (req, res) => {
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

    const { date }: { date: string } = req.body;
    if (!date) {
      res.status(422).json({ error: "Invalid request" });
    }

    let attendanceRecords: {
      numberOfEmployees: number;
      presentEmployees: {
        id: string;
        name: string;
        image: string;
        email: string;
        designation: string;
      }[];
      absentEmployees: {
        id: string;
        name: string;
        image: string;
        email: string;
        designation: string;
      }[];
    } | null = null;

    const employees = await prisma.employees.findMany({
      where: {
        companyEmail: company.email,
      },
      select: {
        id: true,
        name: true,
        image: true,
        designation: true,
        email: true,
      },
    });

    const parsedDate = new Date(
      parseInt(date.split("/")[2]),
      parseInt(date.split("/")[1]) - 1,
      parseInt(date.split("/")[0])
    );

    const presentEmployees: {
      id: string;
      name: string;
      image: string;
      designation: string;
      email: string;
    }[] = [];
    const absentEmployees: {
      id: string;
      name: string;
      image: string;
      designation: string;
      email: string;
    }[] = [];

    for (const employee of employees) {
      const employeeEntries = await prisma.employeeEntry.findMany({
        where: {
          attendance: {
            date: parsedDate.getDate(),
            month: parsedDate.getMonth(),
            year: parsedDate.getFullYear(),
            employeeEmail: company.email,
          },
        },
      });

      if (employeeEntries.length > 0) {
        presentEmployees.push(employee);
      } else {
        absentEmployees.push(employee);
      }
    }

    attendanceRecords = {
      numberOfEmployees: employees.length,
      absentEmployees,
      presentEmployees,
    };

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
      isPresent: boolean;
    }[] = [];
    const numberOfEntriesToTake = take ?? 20;
    const numberOfEntriesToSkip = skip ?? 0;

    for (let i = 0; i < numberOfEntriesToTake; i++) {
      const currentDate = new Date();
      currentDate.setDate(new Date().getDate() - (numberOfEntriesToSkip + i));

      const attendance = await prisma.attendance.findMany({
        where: {
          date: currentDate.getDate(),
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
        },
      });
      if (attendance.length === 0) {
        continue;
      }

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
        isPresent: employeeEntries.length > 0,
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

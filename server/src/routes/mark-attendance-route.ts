import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/db";

import { getEmployeeByEmail } from "../helpers/get-employee-by-email";

import { markAttendanceValidator } from "../validators/mark-attendance-validator";

const markAttendanceRouter = Router();

markAttendanceRouter.post("/", async (req, res) => {
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

    const { qrCodeToken, latitude, longitude } =
      await markAttendanceValidator.parseAsync(req.body);

    const { companyEmail, date, expires } = jwt.verify(
      qrCodeToken,
      process.env.JWT_QR_CODE_SECRET!
    ) as {
      companyEmail: string;
      expires: Date;
      date: Date;
    };

    if (employee.companyEmail !== companyEmail) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (new Date() > expires) {
      res.status(409).json({ error: "The QR code has expired" });
    }

    const attendance = await prisma.attendance.findFirst({
      where: {
        companyEmail: companyEmail,
        employeeEmail: employee.email,
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      },
    });

    if (attendance) {
      const employeeEntry = await prisma.employeeEntry.findFirst({
        where: {
          attendanceId: attendance.id,
          employeeExitId: null,
        },
        orderBy: {
          enteredAt: "desc",
        },
      });
      if (!employeeEntry) {
        await prisma.employeeEntry.create({
          data: {
            enteredAt: new Date(),
            attendanceId: attendance.id,
          },
        });
      } else {
        await prisma.employeeExit.create({
          data: {
            exitedAt: new Date(),
            entryId: employeeEntry.id,
          },
        });
      }
    } else {
      const attendance = await prisma.attendance.create({
        data: {
          companyEmail: companyEmail,
          employeeEmail: employee.email,
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          latitude,
          longitude,
          mode: "Manual",
        },
      });

      await prisma.employeeEntry.create({
        data: {
          enteredAt: new Date(),
          attendanceId: attendance.id,
        },
      });
    }

    res.status(201).json({ message: "Attendance marked successfully" });
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

export { markAttendanceRouter };

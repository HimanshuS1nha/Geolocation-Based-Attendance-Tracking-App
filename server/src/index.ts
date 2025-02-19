import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { prisma } from "./libs/db";

import { calculateDistance } from "./helpers/calculate-distance";

import { signupRouter } from "./routes/signup-route";
import { loginRouter } from "./routes/login-route";
import { resendOtpRouter } from "./routes/resend-otp-route";
import { verifyOtpRouter } from "./routes/verify-otp-route";
import { changePasswordRouter } from "./routes/change-password-route";

import { addEmployeeRouter } from "./routes/add-employee-route";
import { editEmployeeRouter } from "./routes/edit-employee-route";
import { deleteEmployeeRouter } from "./routes/delete-employee-route";
import { editProfileRouter } from "./routes/edit-profile-route";
import { addOfficeLocationRouter } from "./routes/add-office-location-route";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = process.env.PORT || 8000;

const companiesMap = new Map<string, string>();
const employeesMap = new Map<string, string>();

app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));

app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/api/resend-otp", resendOtpRouter);
app.use("/api/verify-otp", verifyOtpRouter);
app.use("/api/change-password", changePasswordRouter);

app.use("/api/add-employee", addEmployeeRouter);
app.use("/api/edit-employee", editEmployeeRouter);
app.use("/api/delete-employee", deleteEmployeeRouter);
app.use("/api/edit-profile", editProfileRouter);
app.use("/api/add-office-location", addOfficeLocationRouter);

io.on("connection", async (socket) => {
  const { token } = socket.handshake.auth;

  const { email, type } = jwt.verify(token, process.env.JWT_SECRET!) as {
    email: string;
    type: "company" | "employee";
  };
  if (!email) {
    return io.to(socket.id).emit("error", { error: "Please login first" });
  }

  if (type === "company") {
    const company = await prisma.companies.findUnique({
      where: {
        email,
      },
    });
    if (!company) {
      return io.to(socket.id).emit("error", { error: "Please login first" });
    }
    if (!company.officeLatitude || !company.officeLongitude) {
      return io
        .to(socket.id)
        .emit("error", { error: "Please set office location first" });
    }

    companiesMap.set(company.id, socket.id);
  } else if (type === "employee") {
    const employee = await prisma.employees.findUnique({
      where: {
        email,
      },
      include: {
        company: true,
      },
    });
    if (!employee) {
      return io.to(socket.id).emit("error", { error: "Please login first" });
    }
    if (!companiesMap.has(employee.company.id)) {
      return io
        .to(socket.id)
        .emit("error", { error: "Company has not begun the attendance" });
    }
    employeesMap.set(employee.id, socket.id);
  } else {
    return io.to(socket.id).emit("error", { error: "Please login first" });
  }

  socket.on(
    "send-location",
    async ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) => {
      const employee = await prisma.employees.findUnique({
        where: {
          email,
        },
        include: {
          company: true,
        },
      });
      if (!employee) {
        return io.to(socket.id).emit("error", { error: "Please login first" });
      }

      if (!employeesMap.has(employee.id)) {
        return io.to(socket.id).emit("error", {
          error: "Some error occured. Please try again later!",
        });
      }
      if (!companiesMap.has(employee.company.id)) {
        return io
          .to(socket.id)
          .emit("error", { error: "Company has not begun the attendance" });
      }

      const distance = calculateDistance(
        latitude,
        longitude,
        employee.company.officeLatitude!,
        employee.company.officeLongitude!
      );

      const attendance = await prisma.attendance.findFirst({
        where: {
          companyEmail: employee.company.email,
          employeeEmail: employee.email,
          date: new Date().getDate(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
      });
      if (attendance) {
        if (distance < 200) {
          return;
        }

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
        if (distance > 200) {
          return;
        }

        const attendance = await prisma.attendance.create({
          data: {
            companyEmail: employee.company.email,
            employeeEmail: employee.email,
            date: new Date().getDate(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            latitude,
            longitude,
            mode: "Geolocation",
          },
        });

        await prisma.employeeEntry.create({
          data: {
            enteredAt: new Date(),
            attendanceId: attendance.id,
          },
        });
      }
    }
  );

  socket.on("disconnect", async () => {
    if (type === "company") {
      const company = await prisma.companies.findUnique({
        where: {
          email,
        },
      });
      if (!company || !companiesMap.has(company.id)) {
        return io.to(socket.id).emit("error", { error: "Please login first" });
      }

      companiesMap.delete(company.id);
    } else if (type === "employee") {
      const employee = await prisma.employees.findUnique({
        where: {
          email,
        },
        include: {
          company: true,
        },
      });

      if (!employee || !employeesMap.has(employee.id)) {
        return io.to(socket.id).emit("error", { error: "Please login first" });
      }

      const attendance = await prisma.attendance.findFirst({
        where: {
          companyEmail: employee.company.email,
          employeeEmail: employee.email,
          date: new Date().getDate(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
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
        if (employeeEntry) {
          await prisma.employeeExit.create({
            data: {
              exitedAt: new Date(),
              entryId: employeeEntry.id,
            },
          });
        }
      }

      employeesMap.delete(employee.id);
    }
  });
});

app.get("/", (_, res) => {
  res.send("Hello World");
  return;
});

server.listen(port, () =>
  console.log(`Listenting on http://localhost:${port}`)
);

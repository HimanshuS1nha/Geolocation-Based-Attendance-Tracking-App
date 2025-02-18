import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

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

io.on("connection", (socket) => {
  console.log(`${socket.id} Joined`);
});

app.get("/", (_, res) => {
  res.send("Hello World");
  return;
});

server.listen(port, () =>
  console.log(`Listenting on http://localhost:${port}`)
);

import { Router } from "express";
import { ZodError } from "zod";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

import { getCompanyByEmail } from "../helpers/get-company-by-email";
import { createAndSendOtp } from "../helpers/create-and-send-otp";
import { getEmployeeByEmail } from "../helpers/get-employee-by-email";

import { loginValidator } from "../validators/login-validator";

const loginRouter = Router();

loginRouter.post("/company", async (req, res) => {
  try {
    const { email, password } = await loginValidator.parseAsync(req.body);

    const company = await getCompanyByEmail(email);
    if (!company) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const doesPasswordMatch = await compare(password, company.password);
    if (!doesPasswordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (!company.emailVerifiedAt) {
      await createAndSendOtp(company.email, "company");
      res.status(403).json({ error: "Please verify your email" });
      return;
    }

    const token = jwt.sign(
      { email: company.email, type: "company" },
      process.env.JWT_SECRET!
    );

    res.status(201).json({
      message: "Logged in successfully",
      token,
      user: {
        name: company.name,
        email: company.email,
        id: company.id,
        image: company.image,
        type: "company",
        hasAddedOfficeLocation: !!(
          company.officeLatitude && company.officeLongitude
        ),
      },
    });
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

loginRouter.post("/employee", async (req, res) => {
  try {
    const { email, password } = await loginValidator.parseAsync(req.body);

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const doesPasswordMatch = await compare(password, employee.password);
    if (!doesPasswordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { email: employee.email, type: "employee" },
      process.env.JWT_SECRET!
    );

    res.status(201).json({
      message: "Logged in successfully",
      token,
      user: {
        name: employee.name,
        email: employee.email,
        id: employee.id,
        image: employee.image,
        type: "employee",
      },
    });
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

export { loginRouter };

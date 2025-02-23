import { Router } from "express";
import jwt from "jsonwebtoken";

import { getCompanyByEmail } from "../helpers/get-company-by-email";

const getQrCodeRouter = Router();

getQrCodeRouter.get("/", async (req, res) => {
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

    const qrToken = jwt.sign(
      {
        date: new Date(),
        companyEmail: company.email,
        expires: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
      },
      process.env.JWT_QR_CODE_SECRET!
    );

    res.status(200).json({ qrToken });
  } catch {
    res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getQrCodeRouter };

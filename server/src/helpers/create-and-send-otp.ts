import { generate } from "otp-generator";

import { prisma } from "../libs/db";
import { sendEmail } from "../libs/send-email";

export const createAndSendOtp = async (
  email: string,
  type: "company" | "employee"
) => {
  const otp = parseInt(
    generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    })
  );

  if (type === "company") {
    await prisma.companyOtp.deleteMany({
      where: {
        companyEmail: email,
      },
    });

    await prisma.companyOtp.create({
      data: {
        companyEmail: email,
        otp,
        expires: new Date(Date.now() + 1000 * 60 * 5),
      },
    });
  } else if (type === "employee") {
    //! Implement for employees
  }

  await sendEmail(email, otp);
};

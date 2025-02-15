import { createTransport } from "nodemailer";

export const sendEmail = async (email: string, otp: number) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: process.env.SECURE_CONNECTION ? true : false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Your otp is: ${otp}. It will expire in 5 mins.</p>`,
  });
};

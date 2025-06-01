import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // e.g., smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,                    // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,   // your SMTP email user
    pass: process.env.SMTP_PASS,   // your SMTP password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer config error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

export default transporter;
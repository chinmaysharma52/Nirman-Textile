import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

console.log("Using Host:", SMTP_HOST);
console.log("Using Port:", SMTP_PORT);
console.log("Using User:", SMTP_USER);
console.log("Password length:", SMTP_PASS ? SMTP_PASS.length : 0);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // false for 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: SMTP_USER,
      subject: "Test Send",
      text: "Test body"
    });
    console.log("Success:", info.messageId);
  } catch (err) {
    console.error("Failure:", err);
  }
}
run();

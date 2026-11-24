import nodemailer from "nodemailer";

export const Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
});

export const EMAIL_SERVICE_TOKEN = "EMAIL_SERVICE";
export const MAIL_TRANSPORTER_TOKEN = "MAIL_TRANSPORTER";
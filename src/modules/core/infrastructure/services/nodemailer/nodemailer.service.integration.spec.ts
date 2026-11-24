import { describe, it, expect, beforeAll, afterAll } from "vitest";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { NodemailerService } from "./nodemailer.service.js";
import { changeEmailTemplate } from "../../email/change-email-template.js";

describe("Nodemailer Integration", () => {
    let transporter: Transporter;
    let mailService: NodemailerService;

    beforeAll(() => {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true"
        });

        mailService = new NodemailerService(transporter);
    });

    afterAll(() => {
        transporter.close();
    });

    it("Should send email through Mailpit.", async () => {
        await expect(
            mailService.send(
                "john@gmail.com",
                "Verification Code to change E-mail.",
                "Request Change E-mail.",
                changeEmailTemplate("123456")
            )
        ).resolves.toBeUndefined();
    });
});

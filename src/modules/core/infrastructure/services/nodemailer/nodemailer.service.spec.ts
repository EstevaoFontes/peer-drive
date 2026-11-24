import { describe, it, vi, beforeEach, expect } from "vitest";
import { NodemailerService } from "./nodemailer.service.js";
import type { Transporter } from "nodemailer";

describe("Test Nodemailer.", () => {
    let nodemailer: NodemailerService;

    const transporterMock = {
        sendMail: vi.fn()
    };

    const input = {
        to: "john@gmail.com",
        subject: "subject test",
        text: "test text",
        html: "<p>test html</p>"
    };

    beforeEach(() => {
        vi.clearAllMocks();

        nodemailer = new NodemailerService(
            transporterMock as unknown as Transporter
        );
    });

    it("Should send email.", async () => {
        transporterMock.sendMail.mockResolvedValueOnce({});

        await nodemailer.send(
            input.to,
            input.subject,
            input.text,
            input.html
        );

        expect(transporterMock.sendMail).toHaveBeenCalledOnce();

        expect(transporterMock.sendMail).toHaveBeenCalledWith({
            from: process.env.SMTP_FROM,
            to: input.to,
            subject: input.subject,
            text: input.text,
            html: input.html
        });
    });

    it("Should throw an error when email sending fails.", async () => {
        const error = new Error("SMTP connection failed.");

        transporterMock.sendMail.mockRejectedValueOnce(error);

        await expect(
            nodemailer.send(
                input.to,
                input.subject,
                input.text,
                input.html
            )
        ).rejects.toThrow("SMTP connection failed.");
    });
});
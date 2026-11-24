import { IMailService } from "../../../services/mail-service.interface.js";
import { MAIL_TRANSPORTER_TOKEN } from "../../email/nodemailer.config.js";
import { Injectable, Inject } from "@nestjs/common";
import { type Transporter } from "nodemailer";

@Injectable()
export class NodemailerService implements IMailService {
    constructor(
        @Inject(MAIL_TRANSPORTER_TOKEN)
        private readonly transporter: Transporter
    ) { }

    async send(to: string, subject: string, text: string, html: string): Promise<void> {

        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

    }

}
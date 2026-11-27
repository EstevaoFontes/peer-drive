import { Module } from "@nestjs/common";
import { NodemailerService } from "../services/nodemailer/nodemailer.service.js";
import { MAIL_SERVICE_TOKEN } from "../../services/mail-service.interface.js";
import { Transporter, MAIL_TRANSPORTER_TOKEN } from "./nodemailer.config.js";

@Module({
    providers: [
        {
            provide: MAIL_TRANSPORTER_TOKEN,
            useValue: Transporter
        },
        NodemailerService,
        {
            provide: MAIL_SERVICE_TOKEN,
            useExisting: NodemailerService
        }
    ],
    exports: [
        MAIL_SERVICE_TOKEN
    ]
})
export class MailModule {}
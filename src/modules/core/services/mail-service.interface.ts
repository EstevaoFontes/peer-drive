export interface IMailService {
    send(to: string, subject: string, text: string, html: string): Promise<void>
};

export const MAIL_SERVICE_TOKEN = Symbol("IMailService");
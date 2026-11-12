export interface IMailService{
    send(recipient: string, subject: string, body: string): Promise<void>
};

export const MAIL_SERVICE_TOKEN = "IMailService";
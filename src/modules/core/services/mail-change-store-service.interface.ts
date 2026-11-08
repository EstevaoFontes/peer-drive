export interface IPendingMailService {
    newEmail: string
    code: string
}

export interface IMailChangeStore {
    save(userId: string, data: IPendingMailService, timeStampInSeconds: number): Promise<void>
    verifyById(UserId: string): Promise<IPendingMailService | null>
    remove(id: string): Promise<void>
}

export const MAIL_CHANGE_STORE_TOKEN = 'IMailChangeStore'
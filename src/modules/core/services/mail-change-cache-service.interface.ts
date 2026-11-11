export interface IPendingMailService {
    newEmail: string
    code: string
}

export interface IMailChangeCacheService {
    save(userId: string, data: IPendingMailService, timeStampInSeconds: number): Promise<void>
    consumeCode(UserId: string, code: string): Promise<{newEmail : string} | null>
}

export const MAIL_CHANGE_CACHE_TOKEN = 'IMailChangeStore'
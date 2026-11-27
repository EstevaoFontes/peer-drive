export interface IPendingMailService {
    newEmail: string
    code: string
}

export interface IMailChangeCacheService {
    save(userId: string, data: IPendingMailService, expireInSeconds: number): Promise<void>
    consumeCode(userId: string, code: string): Promise<{newEmail : string} | null>
}

export const MAIL_CHANGE_CACHE_TOKEN = Symbol("IMailChangeCacheService");
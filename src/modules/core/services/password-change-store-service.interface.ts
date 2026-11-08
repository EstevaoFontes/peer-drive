export interface IPendingPasswordService {
    code: string
}

export interface IPasswordCacheService {

    save(userId: string, code: string, timeStampInSeconds: number): Promise<void>

    verifyById(userId: string): Promise<IPendingPasswordService | null>

    remove(id: string): Promise<void>
}

export const PASSWORD_CACHE_SERVICE_TOKEN = 'IPasswordChangeStore';
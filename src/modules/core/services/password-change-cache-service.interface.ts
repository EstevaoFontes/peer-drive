export interface IPasswordCacheService {

    save(userId: string, code: string, timeStampInSeconds: number): Promise<void>
    consumeCode(userId: string, code: string): Promise<boolean>
}

export const PASSWORD_CACHE_SERVICE_TOKEN = 'IPasswordChangeStore';
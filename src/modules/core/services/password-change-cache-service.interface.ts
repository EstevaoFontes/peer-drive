export interface IPasswordCacheService {

    save(email: string, code: string, timeStampInSeconds: number): Promise<void>

    consumeCode(code: string): Promise<{ email: string } | null>
}

export const PASSWORD_CACHE_SERVICE_TOKEN = "IPasswordChangeStore";
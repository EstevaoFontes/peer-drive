export interface IVerificationResult {
    userID: string
    email: string
}

export const TOKEN_SERVICE_TOKEN = 'ITokenService'

export interface ITokenService {
    generate(payload: {userID: string, email: string}): string
    verify(token: string): IVerificationResult
}


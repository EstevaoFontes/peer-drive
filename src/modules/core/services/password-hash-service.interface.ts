export const HASH_SERVICE_TOKEN = 'IHashService'

export interface IHashService{
    hash(password: string): Promise<string>
    compare(password: string, hashed: string): Promise<boolean>
}
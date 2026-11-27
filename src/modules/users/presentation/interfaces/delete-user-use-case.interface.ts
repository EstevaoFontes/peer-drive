export interface IDeleteUserUseCase {
    execute(token: string): Promise<void>
}

export const DELETE_USER_USE_CASE_TOKEN = Symbol("IDeleteUserUseCase");
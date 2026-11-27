import type { IChangePasswordDTO } from "../../use_cases/user/change-password.use-case.js";

export interface IChangePasswordUseCase {
    execute(token: string, input: IChangePasswordDTO): Promise<void>
}

export const CHANGE_PASSWORD_USE_CASE_TOKEN = Symbol("IChangePasswordUseCase");
import type { IForgotPasswordDTO } from "../../use_cases/user/request-forgot-password.use-case.js";

export interface IForgotPasswordUseCase {
    execute(input: IForgotPasswordDTO): Promise<void>
}

export const FORGOT_PASSWORD_USE_CASE_TOKEN = Symbol("IForgotPasswordUseCase");
import type { IForgotPasswordDTO } from "../../use_cases/user/request-forgot-password.use-case.js";

export interface IRequestForgotPasswordUseCase {
    execute(input: IForgotPasswordDTO): Promise<void>
}

export const REQUEST_FORGOT_PASSWORD_USE_CASE_TOKEN = Symbol("IRequestForgotPasswordUseCase");
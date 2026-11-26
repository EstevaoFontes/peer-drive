import { ConfirmForgotPasswordDTO } from "../../use_cases/user/confirm-forgot-password.use-case.js";

export interface IConfirmForgotPasswordUseCase {
    execute(input: ConfirmForgotPasswordDTO): Promise<void>
}

export const CONFIRM_FORGOT_PASSWORD_USE_CASE = Symbol("IConfirmForgotPasswordUseCase");
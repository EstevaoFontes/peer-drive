import { confirmEmailChangeDTO } from "../../use_cases/user/confirm-email-change.use-case.js";

export interface IConfirmEmailChangeUseCase {
    execute(token: string, input: confirmEmailChangeDTO): Promise<void>
}

export const CONFIRM_EMAIL_CHANGE_USE_CASE_TOKEN = Symbol("IConfirmEmailChangeUseCase");
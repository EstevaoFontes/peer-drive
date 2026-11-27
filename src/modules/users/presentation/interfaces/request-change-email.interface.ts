import { IUpdateEmailDTO } from "../../use_cases/user/request-email-change.use-case.js";

export interface IRequestChangeEmailUseCase{
    execute(token: string, input: IUpdateEmailDTO): Promise<void>
}

export const REQUEST_CHANGE_EMAIL_USE_CASE_TOKEN = Symbol("IRequestChangeEmailUseCase");
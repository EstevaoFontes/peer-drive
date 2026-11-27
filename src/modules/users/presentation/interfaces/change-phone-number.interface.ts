import type { ChangePhoneNumberDTO } from "../../use_cases/user/change-phone-number.use-case.js";

export interface IChangePhoneNumberUseCase {
    execute(token: string, input: ChangePhoneNumberDTO): Promise<void>
}

export const CHANGE_PHONE_NUMBER_USE_CASE_TOKEN = Symbol("IChangePhoneNumberUseCase");
import type { IChangeUserNameDTO } from "../../use_cases/user/change-name.use-case.js";

export interface IChangeNameUseCase {
    execute(token: string, input: IChangeUserNameDTO): Promise<void>
}

export const CHANGE_NAME_USE_CASE_TOKEN = Symbol("IChangeNameUseCase");
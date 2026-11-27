import type { GetUserOutPutDTO } from "../../use_cases/user/get-user-data.use-case.js";

export interface IGetUserUseCase {
    execute(token: string): Promise<GetUserOutPutDTO>
}

export const GET_USER_USE_CASE_TOKEN = Symbol("IGetUserUseCase");
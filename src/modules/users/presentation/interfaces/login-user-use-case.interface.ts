import type { UserLoginDTO, UserLoginOutPutDTO } from "../../use_cases/user/login.use-case.js";

export interface ILoginUserUseCase{
    execute(input: UserLoginDTO): Promise<UserLoginOutPutDTO>
}

export const LOGIN_USER_INTERFACE_TOKEN = Symbol("ILoginUserUseCase");
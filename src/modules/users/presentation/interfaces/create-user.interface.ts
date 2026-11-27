import type { CreateUserDTO } from "../../use_cases/user/create-user.use-case.js";

export interface ICreateUserUseCase {
    execute(input: CreateUserDTO): Promise<void>
}

export const CREATE_USER_USE_CASE_TOKEN = Symbol("ICreateUserUseCase");
import { Controller, Post, Body, BadRequestException, Inject } from "@nestjs/common";
import { loginUserSchema } from "../../schemas/user/login-user.schemas.js";
import { UserLoginOutPutDTO } from "../../../use_cases/user/login.use-case.js";
import { type ILoginUserUseCase, LOGIN_USER_INTERFACE } from "../../interfaces/login-user-use-case.interface.js";


@Controller("auth")
export class AuthController {

    constructor(
        @Inject(LOGIN_USER_INTERFACE)
        private readonly loginUserUseCase: ILoginUserUseCase
    ) { }

    @Post("login")
    async authUser(@Body() body: unknown): Promise<UserLoginOutPutDTO> {

        const result = loginUserSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        return this.loginUserUseCase.execute(result.data);
    }

}
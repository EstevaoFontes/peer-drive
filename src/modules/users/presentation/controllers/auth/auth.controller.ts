import { Controller, Post, Body, BadRequestException, Inject, HttpCode, HttpStatus } from "@nestjs/common";
// SCHEMAS
import { loginUserSchema } from "../../schemas/user/login-user.schemas.js";
import { requestForgotPasswordSchema } from "../../schemas/user/request-forgot-password.schema.js";
import { confirmForgotPasswordSchema } from "../../schemas/user/confirm-forgot-password.schema.js";
// INTERFACES
import { type ILoginUserUseCase, LOGIN_USER_USE_CASE_TOKEN } from "../../interfaces/login-user-use-case.interface.js";
import { type IRequestForgotPasswordUseCase, REQUEST_FORGOT_PASSWORD_USE_CASE_TOKEN } from "../../interfaces/request-forgot-password.interface.js";
import { type IConfirmForgotPasswordUseCase, CONFIRM_FORGOT_PASSWORD_USE_CASE_TOKEN } from "../../interfaces/confirm-forgot-password.interface.js";


interface LoginOutPutDTO {
    accessToken: string
}


@Controller("auth")
export class AuthController {

    constructor(
        @Inject(LOGIN_USER_USE_CASE_TOKEN)
        private readonly loginUserUseCase: ILoginUserUseCase,

        @Inject(REQUEST_FORGOT_PASSWORD_USE_CASE_TOKEN)
        private readonly forgotPasswordUseCase: IRequestForgotPasswordUseCase,

        @Inject(CONFIRM_FORGOT_PASSWORD_USE_CASE_TOKEN)
        private readonly confirmForgotPasswordUseCase: IConfirmForgotPasswordUseCase
    ) { }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: unknown): Promise<LoginOutPutDTO> {

        const result = loginUserSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        return this.loginUserUseCase.execute(result.data);
    }



    @Post("request-forgot-password")
    @HttpCode(HttpStatus.OK)
    async requestForgotPassword(@Body() body: unknown): Promise<{ message: string }> {

        const result = requestForgotPasswordSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.forgotPasswordUseCase.execute(result.data);

        return { message: "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha." };

    }


    @Post("confirm-forgot-password")
    @HttpCode(HttpStatus.OK)
    async confirmForgotPassword(@Body() body: unknown): Promise<{ message: string }> {

        const result = confirmForgotPasswordSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.confirmForgotPasswordUseCase.execute(result.data);

        return { message: "Sua senha foi alterada com sucesso, você já pode fazer o login com a nova senha." };

    }

}
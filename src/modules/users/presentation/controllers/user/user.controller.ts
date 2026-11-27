import {
    Controller,
    Post,
    Get,
    Delete,
    Patch,
    Req,
    Body,
    Inject,
    BadRequestException,
    UnauthorizedException,
    HttpCode,
    HttpStatus
} from "@nestjs/common";
import type { Request } from "express";
// SCHEMA
import { createUserSchema } from "../../schemas/user/create-user.schemas.js";
import { changeNameSchema } from "../../schemas/user/change-name.schema.js";
import { changePhoneNumberSchema } from "../../schemas/user/change-phone-number.schema.js";
import { changePasswordSchema } from "../../schemas/user/change-password.schema.js";
import { requestEmailChangeSchema } from "../../schemas/user/request-email-change.schema.js";
import { confirmEmailChangeSchema } from "../../schemas/user/confirm-email-change.schema.js";
// INTERFACE
import { type ICreateUserUseCase, CREATE_USER_USE_CASE_TOKEN } from "../../interfaces/create-user.interface.js";
import { type IChangeNameUseCase, CHANGE_NAME_USE_CASE_TOKEN } from "../../interfaces/change-name-use-case.interface.js";
import { type IChangePhoneNumberUseCase, CHANGE_PHONE_NUMBER_USE_CASE_TOKEN } from "../../interfaces/change-phone-number.interface.js";
import { type IChangePasswordUseCase, CHANGE_PASSWORD_USE_CASE_TOKEN } from "../../interfaces/change-password-use-case.interface.js";
import { type IGetUserUseCase, GET_USER_USE_CASE_TOKEN } from "../../interfaces/get-user-use-case.interface.js";
import { type IDeleteUserUseCase, DELETE_USER_USE_CASE_TOKEN } from "../../interfaces/delete-user-use-case.interface.js";
import { type IRequestChangeEmailUseCase, REQUEST_CHANGE_EMAIL_USE_CASE_TOKEN } from "../../interfaces/request-change-email.interface.js";
import { type IConfirmEmailChangeUseCase, CONFIRM_EMAIL_CHANGE_USE_CASE_TOKEN } from "../../interfaces/confirm-email.interface.js";
// DTO
import type { GetUserOutPutDTO } from "../../../use_cases/user/get-user-data.use-case.js";

@Controller("user")
export class UserController {
    constructor(
        @Inject(CREATE_USER_USE_CASE_TOKEN)
        private readonly createUserUseCase: ICreateUserUseCase,

        @Inject(CHANGE_NAME_USE_CASE_TOKEN)
        private readonly changeNameUseCase: IChangeNameUseCase,

        @Inject(CHANGE_PHONE_NUMBER_USE_CASE_TOKEN)
        private readonly changePhoneNumberUseCase: IChangePhoneNumberUseCase,

        @Inject(CHANGE_PASSWORD_USE_CASE_TOKEN)
        private readonly changePasswordUseCase: IChangePasswordUseCase,

        @Inject(GET_USER_USE_CASE_TOKEN)
        private readonly getUserUseCase: IGetUserUseCase,

        @Inject(DELETE_USER_USE_CASE_TOKEN)
        private readonly deleteUserUseCase: IDeleteUserUseCase,

        @Inject(REQUEST_CHANGE_EMAIL_USE_CASE_TOKEN)
        private readonly changeEmailUseCase: IRequestChangeEmailUseCase,

        @Inject(CONFIRM_EMAIL_CHANGE_USE_CASE_TOKEN)
        private readonly confirmEmailChangeUseCase: IConfirmEmailChangeUseCase
    ) { }


    @Post("create")
    async createUser(@Body() body: unknown): Promise<{ message: string }> {

        const result = createUserSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.createUserUseCase.execute(result.data);

        return { message: "User created successfully" };
    }


    @Patch("change-name")
    async changeName(@Body() body: unknown, @Req() request: Request): Promise<{ message: string }> {

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException("There was an issue with access.");
        }

        const result = changeNameSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.changeNameUseCase.execute(token, result.data);

        return { message: "Username successfully changed." };
    }

    @Patch("change-phone-number")
    async changePhoneNumber(@Body() body: unknown, @Req() request: Request): Promise<{ message: string }> {

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException("There was an issue with access.");
        }

        const result = changePhoneNumberSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.changePhoneNumberUseCase.execute(token, result.data);

        return { message: "Phone Number successfully changed." };
    }


    @Patch("change-password")
    async changePassword(@Body() body: unknown, @Req() request: Request): Promise<{ message: string }> {

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException("There was an issue with access.");
        }

        const result = changePasswordSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.changePasswordUseCase.execute(token, result.data);

        return { message: "Password successfully changed." };
    }


    @Get("get-user")
    async getUser(@Req() request: Request): Promise<GetUserOutPutDTO> {

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException("There was an issue with access.");
        }

        return this.getUserUseCase.execute(token);
    }

    @Delete("delete-user")
    async deleteUser(@Req() request: Request): Promise<{ message: string }> {

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException("There was an issue with access.");
        }

        await this.deleteUserUseCase.execute(token);

        return { message: "The user has been successfully deleted." };
    }

    @Post("request-email")
    @HttpCode(HttpStatus.OK)
    async requestEmail(@Body() body: unknown, @Req() request: Request): Promise<{ message: string }> {

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException("There was an issue with access.");
        }

        const result = requestEmailChangeSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.changeEmailUseCase.execute(token, result.data);

        return { message: "A confirmation code has been sent to the new email address." };
    }

    @Patch("confirm-email")
    async confirmEmail(@Body() body: unknown, @Req() request: Request): Promise<{ message: string }> {

        const token = request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException("There was an issue with access.");
        }

        const result = confirmEmailChangeSchema.safeParse(body);

        if (!result.success) {
            throw new BadRequestException(result.error.issues[0].message);
        }

        await this.confirmEmailChangeUseCase.execute(token, result.data);

        return { message: "The email has been updated successfully." };
    }
}

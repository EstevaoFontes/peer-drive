import { Module } from "@nestjs/common";
// CONTROLLERS
import { UserController } from "./presentation/controllers/user/user.controller.js";
import { AuthController } from "./presentation/controllers/auth/auth.controller.js";
// USE CASES
import { CreateUserUseCase } from "./use_cases/user/create-user.use-case.js";
import { ChangeUserNameUseCase } from "./use_cases/user/change-name.use-case.js";
import { ChangePasswordUseCase } from "./use_cases/user/change-password.use-case.js";
import { ChangePhoneNumberUseCase } from "./use_cases/user/change-phone-number.use-case.js";
import { RequestEmailChangeUseCase } from "./use_cases/user/request-email-change.use-case.js";
import { ConfirmEmailChangeUseCase } from "./use_cases/user/confirm-email-change.use-case.js";
import { RequestForgotPasswordUseCase } from "./use_cases/user/request-forgot-password.use-case.js";
import { ConfirmForgotPasswordUseCase } from "./use_cases/user/confirm-forgot-password.use-case.js";
import { GetUserDataUseCase } from "./use_cases/user/get-user-data.use-case.js";
import { DeleteUserUseCase } from "./use_cases/user/delete-user.use-case.js";
import { LoginUserUseCase } from "./use_cases/user/login.use-case.js";
// INTERFACE USE CASE PROVIDERS TOKENS
import { CREATE_USER_USE_CASE_TOKEN } from "./presentation/interfaces/create-user.interface.js";
import { CHANGE_NAME_USE_CASE_TOKEN } from "./presentation/interfaces/change-name-use-case.interface.js";
import { CHANGE_PASSWORD_USE_CASE_TOKEN } from "./presentation/interfaces/change-password-use-case.interface.js";
import { CHANGE_PHONE_NUMBER_USE_CASE_TOKEN } from "./presentation/interfaces/change-phone-number.interface.js";
import { REQUEST_CHANGE_EMAIL_USE_CASE_TOKEN } from "./presentation/interfaces/request-change-email.interface.js";
import { CONFIRM_EMAIL_CHANGE_USE_CASE_TOKEN } from "./presentation/interfaces/confirm-email.interface.js";
import { REQUEST_FORGOT_PASSWORD_USE_CASE_TOKEN } from "./presentation/interfaces/request-forgot-password.interface.js";
import { CONFIRM_FORGOT_PASSWORD_USE_CASE_TOKEN } from "./presentation/interfaces/confirm-forgot-password.interface.js";
import { GET_USER_USE_CASE_TOKEN } from "./presentation/interfaces/get-user-use-case.interface.js";
import { DELETE_USER_USE_CASE_TOKEN } from "./presentation/interfaces/delete-user-use-case.interface.js";
import { LOGIN_USER_USE_CASE_TOKEN } from "./presentation/interfaces/login-user-use-case.interface.js";
// REPOSITORY
import { USER_REPOSITORY_TOKEN } from "./domain/repositories/user.repository.js";
// IMPLEMENTS USER REPOSITORY
import { UserRepository } from "./infrastructure/repositories/user.repository.js";
// INTERFACES TOKEN SERVICES
import { HASH_SERVICE_TOKEN } from "../core/services/password-hash-service.interface.js";
import { CODE_GENERATOR_SERVICE_TOKEN } from "../core/services/generate-code-service.interface.js";
import { TOKEN_SERVICE_TOKEN } from "../core/services/token-service.interface.js";
import { MAIL_CHANGE_CACHE_TOKEN } from "../core/services/mail-change-cache-service.interface.js";
import { PASSWORD_CACHE_SERVICE_TOKEN } from "../core/services/password-change-cache-service.interface.js";
// IMPLEMENTS SERVICES
import { BcryptHashService } from "../core/infrastructure/services/bcrypt/bcrypt-hash.service.js";
import { CodeGeneratorService } from "../core/infrastructure/services/crypto/code-generator.service.js";
import { TokenGeneratorService } from "../core/infrastructure/services/jwt/token-generator.service.js";
import { RedisEmailCache } from "../core/infrastructure/services/redis/redis-email.service.js";
import { RedisPasswordCache } from "../core/infrastructure/services/redis/redis-password.service.js";
// MODULES
import { DatabaseModule } from "../core/infrastructure/database/database.module.js";
import { MailModule } from "../core/infrastructure/email/mail.module.js";
import { RedisModule } from "../core/infrastructure/cache/redis.module.js";
import { UserPersistenceModule } from "./infrastructure/UserPersistence.module.js";

@Module({
    imports: [
        DatabaseModule,
        MailModule,
        RedisModule,
        UserPersistenceModule
    ],

    controllers: [
        UserController,
        AuthController
    ],

    providers: [
        {
            provide: CREATE_USER_USE_CASE_TOKEN,
            useClass: CreateUserUseCase
        },
        {
            provide: USER_REPOSITORY_TOKEN,
            useClass: UserRepository
        },
        {
            provide: CHANGE_NAME_USE_CASE_TOKEN,
            useClass: ChangeUserNameUseCase
        },
        {
            provide: CHANGE_PASSWORD_USE_CASE_TOKEN,
            useClass: ChangePasswordUseCase
        },
        {
            provide: CHANGE_PHONE_NUMBER_USE_CASE_TOKEN,
            useClass: ChangePhoneNumberUseCase
        },
        {
            provide: REQUEST_CHANGE_EMAIL_USE_CASE_TOKEN,
            useClass: RequestEmailChangeUseCase
        },
        {
            provide: CONFIRM_EMAIL_CHANGE_USE_CASE_TOKEN,
            useClass: ConfirmEmailChangeUseCase
        },
        {
            provide: REQUEST_FORGOT_PASSWORD_USE_CASE_TOKEN,
            useClass: RequestForgotPasswordUseCase
        },
        {
            provide: CONFIRM_FORGOT_PASSWORD_USE_CASE_TOKEN,
            useClass: ConfirmForgotPasswordUseCase
        },
        {
            provide: GET_USER_USE_CASE_TOKEN,
            useClass: GetUserDataUseCase
        },
        {
            provide: DELETE_USER_USE_CASE_TOKEN,
            useClass: DeleteUserUseCase
        },
        {
            provide: LOGIN_USER_USE_CASE_TOKEN,
            useClass: LoginUserUseCase
        },
        {
            provide: HASH_SERVICE_TOKEN,
            useClass: BcryptHashService
        },
        {
            provide: CODE_GENERATOR_SERVICE_TOKEN,
            useClass: CodeGeneratorService
        },
        {
            provide: TOKEN_SERVICE_TOKEN,
            useClass: TokenGeneratorService
        },
        {
            provide: PASSWORD_CACHE_SERVICE_TOKEN,
            useClass: RedisPasswordCache
        },
        {
            provide: MAIL_CHANGE_CACHE_TOKEN,
            useClass: RedisEmailCache
        },
    ]
})

export class UserModule { };
import { type ICodeGeneratorService, CODE_GENERATOR_SERVICE_TOKEN } from "../../core/services/generate-code-service.interface.js";
import { type IMailService, MAIL_SERVICE_TOKEN } from "../../core/services/mail-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type IPasswordCacheService, PASSWORD_CACHE_SERVICE_TOKEN } from "../../core/services/password-change-cache-service.interface.js";
import { Injectable, Inject } from "@nestjs/common";

interface IForgotPasswordDTO {
    email: string
}

@Injectable()
export class RequestForgotPasswordUseCase {
    constructor(

        @Inject(CODE_GENERATOR_SERVICE_TOKEN)
        private readonly codeGenerator: ICodeGeneratorService,

        @Inject(MAIL_SERVICE_TOKEN)
        private readonly mailService: IMailService,

        @Inject(PASSWORD_CACHE_SERVICE_TOKEN)
        private readonly passwordCacheService: IPasswordCacheService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository

    ) { };

    async execute(input: IForgotPasswordDTO): Promise<void> {

        const user = await this.userRepository.findByEmail(input.email);

        if (!user) {
            return
        };

        const code = this.codeGenerator.generate();

        await this.passwordCacheService.save(user.id.value, code, 300)

        await this.mailService.send(input.email, "Seu código de confirmação.", `Seu código de confirmação é ${code}.`);

    };
};

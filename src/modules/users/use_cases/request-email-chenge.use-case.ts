import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type IMailService, MAIL_SERVICE_TOKEN } from "../../core/services/mail-service.interface.js";
import { type ICodeGeneratorService, CODE_GENERATOR_SERVICE_TOKEN } from "../../core/services/generate-code-service.interface.js";
import { type IMailChangeCacheService, MAIL_CHANGE_CACHE_TOKEN } from "../../core/services/mail-change-cache-service.interface.js";
import { Inject, Injectable, BadRequestException, UnauthorizedException, ConflictException } from "@nestjs/common";


interface IUpdateEmailDTO {
    newEmail: string
}

@Injectable()
export class RequestEmailChangeUseCase {

    constructor(
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,

        @Inject(MAIL_SERVICE_TOKEN)
        private readonly mailService: IMailService,

        @Inject(CODE_GENERATOR_SERVICE_TOKEN)
        private readonly codeGeneratorService: ICodeGeneratorService,

        @Inject(MAIL_CHANGE_CACHE_TOKEN)
        private readonly mailChangeCacheStore: IMailChangeCacheService,
    ) { };

    async execute(token: string, input: IUpdateEmailDTO): Promise<void> {

        const verifyToken = await this.tokenService.verify(token);

        if (!verifyToken) {
            throw new UnauthorizedException('Token inválido ou expirado.')
        };

        if (input.newEmail === verifyToken.email) {
            throw new BadRequestException("O novo email deve ser diferente do email atual.")
        };

        const user = await this.userRepository.existEmail(input.newEmail);

        if (user) {
            throw new ConflictException("Esse email já está em uso por outra conta.")
        };


        const code = this.codeGeneratorService.generate();

        const data = {
            newEmail: input.newEmail,
            code: code
        };

        await this.mailChangeCacheStore.save(verifyToken.userID, data, 300);

        await this.mailService.send(
            input.newEmail,
            "Alteração de email do usuário",
            `Seu Código de confirmação é ${code}`
        );

    };
};




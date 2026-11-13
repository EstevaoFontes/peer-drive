import { Inject, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type IMailChangeCacheService, MAIL_CHANGE_CACHE_TOKEN } from "../../core/services/mail-change-cache-service.interface.js";

interface confirmEmailChengeDTO {
    code: string
}

@Injectable()
export class ConfirmEmailChengeUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,

        @Inject(MAIL_CHANGE_CACHE_TOKEN)
        private readonly mailChangeStoreService: IMailChangeCacheService,

        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService

    ) { };

    async execute(token: string, input: confirmEmailChengeDTO): Promise<void> {

        const payload = await this.tokenService.verify(token);

        if (!payload) {
            throw new UnauthorizedException("Token inválido ou expirado.");
        };

        const pending = await this.mailChangeStoreService.consumeCode(payload.userID, input.code);

        if (!pending) {
            throw new NotFoundException("Código inválido ou expirado.");
        };

        const user = await this.userRepository.findById(payload.userID);

        if (!user) {
            throw new NotFoundException("Houve um erro, por favor tente novamente mais tarde.");
        }

        if(payload.userID !== user.id.value){
            throw new UnauthorizedException("Houve erro, tente novamente mais tarde");
        }

        user.changeEmail(pending.newEmail);

        await this.userRepository.update(user);
    };
};
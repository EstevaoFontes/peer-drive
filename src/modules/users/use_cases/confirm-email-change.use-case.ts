import { Inject, Injectable } from "@nestjs/common";
import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type IMailChangeStore, MAIL_CHANGE_STORE_TOKEN } from "../../core/services/mail-change-store-service.interface.js";

interface confirmEmailChangeDTO {
    code: string
    token: string
    userId: string
}

@Injectable()
export class ConfirmEmailChangeUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,

        @Inject(MAIL_CHANGE_STORE_TOKEN)
        private readonly mailChangeStoreService: IMailChangeStore,

        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService

    ) { };

    async execute(input: confirmEmailChangeDTO): Promise<void> {

        const veirifyToken = await this.tokenService.verify(input.token);

        if (!veirifyToken.email || !veirifyToken.userID) {
            throw new Error("Token inválido ou expirado.")
        };

        const idExtracted = veirifyToken.userID;

        if (idExtracted !== input.userId) {
            throw new Error("Houve um erro, tente novamente.")
        }

        const pending = await this.mailChangeStoreService.verifyById(idExtracted);

        if (!pending) {
            throw new Error("Código inválido ou expirado.")
        };

        if (pending.code !== input.code) {
            throw new Error("Código inválido ou expirado.")
        };

        const user = await this.userRepository.findById(idExtracted);

        if (!user) {
            throw new Error('Houve um erro, por favor tente novamente mais tarde.')
        }

        user.changeEmail(pending.newEmail);

        await this.userRepository.update(user);

        await this.mailChangeStoreService.remove(idExtracted);
    };
};
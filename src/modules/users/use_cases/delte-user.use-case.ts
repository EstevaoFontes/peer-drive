import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { Inject, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) { };

    async execute(token: string): Promise<void> {

        const payload = await this.tokenService.verify(token);

        if (!payload) {
            throw new UnauthorizedException("Token inválido ou expirado.");
        }


        const deleted = await this.userRepository.delete(payload.userID);

        if (!deleted) {
            throw new NotFoundException("Usuário não encontrado.");
        }
    };
};
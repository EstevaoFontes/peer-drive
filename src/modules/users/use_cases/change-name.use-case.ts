import { Inject, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";

interface IChangeUserNameDTO {
    name: string
}

@Injectable()
export class ChangeUserNameUseCase {
    constructor(

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,

        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService

    ) { };

    async execute(token: string, input: IChangeUserNameDTO): Promise<void> {

        const payload = await this.tokenService.verify(token);

        if (!payload) {
            throw new UnauthorizedException("Ocorreu um erro ao autenticar, tente novamente.")
        };

        const user = await this.userRepository.findById(payload.userID);

        if (!user) {
            throw new NotFoundException("Ocorreu um erro, tente novamente.")
        };

        user.changeName(input.name);

        await this.userRepository.update(user);
    }
}


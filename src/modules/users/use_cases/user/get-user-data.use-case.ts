import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../../domain/repositories/user.repository.js";
import { Injectable, Inject, UnauthorizedException, NotFoundException } from "@nestjs/common";

interface GetUserDataDTO {
    readonly email: string
    readonly name: string
    readonly cpf: string
    readonly phoneNumber: string
    readonly createdAt: Date
    readonly updatedAt: Date
}

@Injectable()
export class GetUserDataUseCase {
    constructor(
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(token: string): Promise<GetUserDataDTO> {

        const payload = await this.tokenService.verify(token);

        if (!payload) {
            throw new UnauthorizedException("Houve um erro, tente novamente mais tarde.");
        }

        const user = await this.userRepository.findById(payload.userID);

        if (!user) {
            throw new NotFoundException("Houve um erro, tente novamente mais tarde.");
        }

        return {
            email: user.email.value,
            name: user.name,
            cpf: user.cpf.value,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}

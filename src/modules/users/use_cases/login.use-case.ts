import { type IHashService, HASH_SERVICE_TOKEN } from "../../core/services/password-hash-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";
import { Injectable, Inject, BadRequestException, InternalServerErrorException } from "@nestjs/common";

interface UserLoginDTO {
    email: string
    password: string
}


@Injectable()
export class LoginUserUserCase {

    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,

        @Inject(HASH_SERVICE_TOKEN)
        private readonly hashService: IHashService,

        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService
    ) { }

    async execute(input: UserLoginDTO): Promise<{ accessToken: string }> {

        const user = await this.userRepository.findByEmail(input.email);

        if (!user) {
            throw new BadRequestException("Email ou senha inválidos.");
        }

        const comparePassword = await this.hashService.compare(input.password, user.passwordValue);

        if (!comparePassword) {
            throw new BadRequestException("Email ou senha inválidos.");
        }

        const accessToken = await this.tokenService.generate({
            userID: user.id.value,
            email: user.email.value
        });

        if (!accessToken) {
            throw new InternalServerErrorException("Houve um erro ao te autenticar, por favor tente novamente mais tarde.");
        }

        return { accessToken };
    };
};
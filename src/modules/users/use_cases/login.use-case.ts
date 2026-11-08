import { type IHashService, HASH_SERVICE_TOKEN } from "../../core/services/password-hash-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";
import { Injectable, Inject } from "@nestjs/common";

interface IUserLoginDTO {
    email: string
    password: string
};

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

    async execute(input: IUserLoginDTO): Promise<{ accessToken: string }> {

        const user = await this.userRepository.findByEmail(input.email)

        if (!user) {
            throw new Error('Email ou senha inválidos.')
        }

        const comparePassword = await this.hashService.compare(input.password, user.passwordValue)

        if (!comparePassword) {
            throw new Error('Email ou senha inválidos.')
        }

        const accessToken = this.tokenService.generate({
            userID: user.id.value,
            email: user.email.value
        });

        return { accessToken };
    };
};
import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "../domain/repositories/user.repository.js";
import { type IHashService, HASH_SERVICE_TOKEN } from "../../core/services/password-hash-service.interface.js";
import { User } from "../domain/entities/user.entity.js";

export interface CreateUserDTO {
    name: string;
    email: string;
    cpf: string;
    password: string;
    confirmPassword: string;
}

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,

        @Inject(HASH_SERVICE_TOKEN)
        private readonly hashService: IHashService
    ) { }

    async execute(input: CreateUserDTO): Promise<void> {

        if (input.password.trim() !== input.confirmPassword.trim()) {
            throw new BadRequestException('As senhas não são iguais.')
        }

        const isExistEmail = await this.userRepository.existEmail(input.email);

        if (isExistEmail) {
            throw new BadRequestException('Esse email ja está cadastrado.')
        }

        const hashPassword = await this.hashService.hash(input.password)

        const user = User.create(input.email, input.name, input.cpf, hashPassword)

        await this.userRepository.create(user)

    };
};
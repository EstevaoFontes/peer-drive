import { type IPasswordCacheService, PASSWORD_CACHE_SERVICE_TOKEN } from "../../core/services/password-change-cache-service.interface.js";
import { type IHashService, HASH_SERVICE_TOKEN } from "../../core/services/password-hash-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";

interface ConfirmForgotPasswordDTO {
    code: string
    newPassword: string
    confirmNewPassword: string
};

@Injectable()
export class ConfirmForgotPasswordUseCase {
    constructor(
        @Inject(PASSWORD_CACHE_SERVICE_TOKEN)
        private readonly passwordCacheService: IPasswordCacheService,

        @Inject(HASH_SERVICE_TOKEN)
        private readonly hashService: IHashService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
    ) { };

    async execute(input: ConfirmForgotPasswordDTO): Promise<void> {

        if (input.newPassword.length < 6) {
            throw new BadRequestException("A senha não pode ser menor que 6 caracteres.");
        };

        if (input.newPassword !== input.confirmNewPassword) {
            throw new BadRequestException("As senhas devem ser iguais.");
        }

        const pending = await this.passwordCacheService.consumeCode(input.code);

        if (!pending) {
            throw new NotFoundException("Código inválido ou expirado.");
        }
        const user = await this.userRepository.findByEmail(pending.email);

        if (!user) {
            throw new NotFoundException("Código inválido ou expirado.");
        };

        const hashPassword = await this.hashService.hash(input.newPassword);

        user.changePassword(hashPassword);

        await this.userRepository.update(user);

    };
};
import { type IPasswordCacheService, PASSWORD_CACHE_SERVICE_TOKEN } from "../../core/services/password-change-store-service.interface.js";
import { type IHashService, HASH_SERVICE_TOKEN } from "../../core/services/password-hash-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { Injectable, Inject } from "@nestjs/common";

interface IPasswordConfirmDTO {
    code: string
    email: string
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

    async execute(input: IPasswordConfirmDTO): Promise<void> {

        if (input.newPassword !== input.confirmNewPassword) {
            throw new Error("As senhas devem ser iguais.")
        }

        const user = await this.userRepository.findByEmail(input.email);

        if (!user) {
            throw new Error("Código inválido ou expirado.");
        };

        const pending = await this.passwordCacheService.verifyById(user.id.value);

        if (!pending) {
            throw new Error("Código inválido ou expirado.")
        }

        if (input.code !== pending.code) {
            throw new Error("Código inválido ou expirado.")
        };

        const hashPassword = await this.hashService.hash(input.newPassword);

        user.changePassword(hashPassword);  

        await this.userRepository.update(user);

        await this.passwordCacheService.remove(user.id.value);
    };
};
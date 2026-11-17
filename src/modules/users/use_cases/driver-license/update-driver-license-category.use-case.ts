import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../../domain/repositories/user.repository.js";
import { Injectable, Inject, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";

interface UpdateDriverLicenseCategoryDTO {
    readonly category: DriveLicenseCategory
}

@Injectable()
export class UpdateDriverLicenseCategoryUseCase {
    constructor(
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(token: string, input: UpdateDriverLicenseCategoryDTO): Promise<void> {

        const payload = await this.tokenService.verify(token);

        if (!payload) {
            throw new UnauthorizedException("Ocorreu um erro, tente novamente.");
        }

        const user = await this.userRepository.findByIdWithDriverLicense(payload.userID);

        if (!user) {
            throw new NotFoundException("Usuário não encontrado.");
        }

        user.updateDriverLicenseCategory(input.category);

        await this.userRepository.update(user);
    }
}
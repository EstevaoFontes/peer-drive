import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../../domain/repositories/user.repository.js";
import { Injectable, Inject, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";

interface CreateDriverLicenseDTO {
    registration: string
    category: DriveLicenseCategory
    firstLicenseDate: Date,
    expirationDate: Date
}

@Injectable()
export class CreateDriverLicenseUseCase {
    constructor(
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(token: string, input: CreateDriverLicenseDTO): Promise<void> {

        const payload = await this.tokenService.verify(token);

        if (!payload) {
            throw new UnauthorizedException("Houve um erro de autenticação, tente novamente mais tarde.");
        }

        const user = await this.userRepository.findByIdWithDriverLicense(payload.userID);

        if (!user) {
            throw new NotFoundException("Houve um erro, tente novamente mais tarde.");
        }

        user.addDriverLicense({
            registration: input.registration,
            category: input.category,
            firstLicenseDate: input.firstLicenseDate,
            expirationDate: input.expirationDate
        });

        await this.userRepository.update(user);
    }
}
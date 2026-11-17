import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../../core/services/token-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../../domain/repositories/user.repository.js";
import { Inject, Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { GetDriverLicenseDTO } from "../../domain/entities/user.entity.js";

@Injectable()
export class GetDriverLicenseDataUseCase {
    constructor(
        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(token: string): Promise<GetDriverLicenseDTO | null> {

        const payload = await this.tokenService.verify(token);

        if (!payload) {
            throw new UnauthorizedException("Ocorreu um erro, tente novamente.");
        }

        const user = await this.userRepository.findByIdWithDriverLicense(payload.userID);

        if (!user) {
            throw new NotFoundException("Usuário não encontrado.");
        }

        const data = user.driverLicense;


        if (data === undefined) {
            throw new Error("A CNH não foi carregada corretamente.");
        }

        return data;
    }
}
import { type IHashService, HASH_SERVICE_TOKEN } from "../../core/services/password-hash-service.interface.js";
import { type IUserRepository, USER_REPOSITORY_TOKEN } from "../domain/repositories/user.repository.js";
import { type ITokenService, TOKEN_SERVICE_TOKEN } from "../../core/services/token-service.interface.js";
import { Injectable, Inject, BadRequestException, UnauthorizedException, NotFoundException } from "@nestjs/common";

interface IChangePasswordDTO {
    actualPassword: string
    newPassword: string
    confirmNewPassword: string
}

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,

        @Inject(HASH_SERVICE_TOKEN)
        private readonly hashService: IHashService,

        @Inject(TOKEN_SERVICE_TOKEN)
        private readonly tokenService: ITokenService,
    ) { };

    async execute(token: string, input: IChangePasswordDTO): Promise<void>{

        if(input.confirmNewPassword !== input.newPassword){
            throw new BadRequestException("As senhas devem ser iguais.",)
        };

        const payload = await this.tokenService.verify(token)

        if(!payload){
            throw new UnauthorizedException("Houve um erro ao te autenticar, tente novamente mais tarde.")
        }

        const user = await this.userRepository.findById(payload.userID);

        if(!user){
            throw new NotFoundException("Houve um erro, por favor tente novamente mais tarde.")
        };

        const isSamePassword = await this.hashService.compare(input.actualPassword, user.passwordValue);

        if(!isSamePassword){
            throw new UnauthorizedException("Senha incorreta.")
        };

        const hashNewPassword = await this.hashService.hash(input.newPassword); 

        user.changePassword(hashNewPassword);

        await this.userRepository.update(user);

    };
}


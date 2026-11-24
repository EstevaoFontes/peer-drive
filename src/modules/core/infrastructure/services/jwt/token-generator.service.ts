import { ITokenService, IVerificationResult } from "../../../services/token-service.interface.js";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenGeneratorService implements ITokenService {

    constructor(
        private readonly jwtService: JwtService
    ) { }

    async generate(payload: { userID: string; email: string; }): Promise<string | null> {

        const createToken = { userID: payload.userID, email: payload.email };

        try {
            return await this.jwtService.signAsync(createToken);

        } catch {
            return null;
        }
    }

    async verify(token: string): Promise<IVerificationResult | null> {

        try {
            return await this.jwtService.verifyAsync(token);

        } catch {
            return null;
        }
    }
}
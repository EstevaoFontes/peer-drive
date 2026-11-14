import { describe, it, expect } from "vitest";
import { TokenGeneratorService } from "./token-generator.service.js";
import { JwtService } from "@nestjs/jwt";

describe("Test generation token and verification.", () => {

    const jwtService = new JwtService({
        secret: "test-secret"
    });

    const tokenGeneratorService = new TokenGeneratorService(jwtService);

    it("Should generate token in string and verify if token has user id and email.", async () => {

        const token = await tokenGeneratorService.generate({
            userID: "abc-123",
            email: "john@gmail.com"
        });

        if (!token) {
            throw new Error("Token generation failed.");
        }

        const payload = await tokenGeneratorService.verify(token);

        expect(typeof token).toBe("string");
        expect(payload).toHaveProperty("userID", "abc-123");
        expect(payload).toHaveProperty("email", "john@gmail.com");
    });

});
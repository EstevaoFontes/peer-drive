import { describe, it, expect } from "vitest";
import { BcryptHashService } from "./bcrypt-hash.service.js";

describe("Test service bcrypt hash password and compare password.", () => {

    const bcryptHashService = new BcryptHashService();

    const input = {
        password: "senha-teste"
    };

    it("Should hash password.", async () => {

        const hash = await bcryptHashService.hash(input.password);

        expect(typeof hash).toBe("string");
        expect(hash).not.toBe(input.password);

    });

    it("Should compare password and return true.", async () => {

        const hash = await bcryptHashService.hash(input.password);

        const isValid = await bcryptHashService.compare(input.password, hash);

        expect(isValid).toBe(true);

    });

    it("Should compare password and return false.", async () => {

        const hash = await bcryptHashService.hash(input.password);

        const isValid = await bcryptHashService.compare("senha-diferente", hash);

        expect(isValid).toBe(false);

    });
});



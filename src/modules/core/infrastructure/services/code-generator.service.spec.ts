import { describe, it, expect } from "vitest";
import { CodeGeneratorService } from "./code-generator.service.js";

describe("Test service a six digit code.", () => {

    const codeGeneratorService = new CodeGeneratorService();

    it("Should generate code.", () => {

        const code = codeGeneratorService.generate();

        expect(typeof code).toBe("string");
        expect(code).toHaveLength(6);
        expect(code).toMatch(/^\d{6}$/);

    });
});



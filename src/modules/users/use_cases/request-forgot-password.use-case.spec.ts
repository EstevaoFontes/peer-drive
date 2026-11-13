import { ICodeGeneratorService } from "../../core/services/generate-code-service.interface.js";
import { IMailService } from "../../core/services/mail-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IPasswordCacheService } from "../../core/services/password-change-cache-service.interface.js";
import { RequestForgotPasswordUseCase } from "./request-forgot-password.use-case.js";
import { User } from "../domain/entities/user.entity.js";
import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";

describe("Test Request Forgot password.", () => {

    type ICodeGeneratorServiceMock = Mocked<ICodeGeneratorService>;
    type IMailServiceMock = Mocked<IMailService>;
    type IUserRepositoryMock = Mocked<IUserRepository>;
    type IPasswordCacheServiceMock = Mocked<IPasswordCacheService>;

    let codeGeneratorServiceMock: ICodeGeneratorServiceMock;
    let mailServiceMock: IMailServiceMock;
    let userRepositoryMock: IUserRepositoryMock;
    let passwordCacheMock: IPasswordCacheServiceMock;
    let requestForgotPasswordUseCase: RequestForgotPasswordUseCase;
    let user: User;

    const input = {
        email: "john@gmail.com"
    };

    const createUser = () => User.restore({
        id: "1234-abc",
        email: "john@gmail.com",
        name: "John",
        cpf: "54587419516",
        isContractAccepted: true,
        password: "qwerty-a-12345",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    beforeEach(() => {
        codeGeneratorServiceMock = {
            generate: vi.fn(),
        };

        mailServiceMock = {
            send: vi.fn()
        };

        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        passwordCacheMock = {
            save: vi.fn(),
            consumeCode: vi.fn()
        };

        user = createUser();

        requestForgotPasswordUseCase = new RequestForgotPasswordUseCase(
            codeGeneratorServiceMock,
            mailServiceMock,
            passwordCacheMock,
            userRepositoryMock
        );
    });

    it("Should verify is email exist, generate code, send email and save new password in cache.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(codeGeneratorServiceMock.generate).mockReturnValue("123456");

        await requestForgotPasswordUseCase.execute(input);

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
        expect(userRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);

        expect(codeGeneratorServiceMock.generate).toHaveBeenCalledTimes(1);

        expect(passwordCacheMock.save).toHaveBeenCalledWith("123456", input.email, 300);
        expect(passwordCacheMock.save).toHaveBeenCalledTimes(1);

        expect(mailServiceMock.send).toHaveBeenCalledWith(
            input.email,
            "Seu código de confirmação.", "Seu código de confirmação é 123456."
        );
        expect(mailServiceMock.send).toHaveBeenCalledTimes(1);
    });

    it("Should return silently and not execute services if email doesn't exist in database.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);

        await expect(requestForgotPasswordUseCase.execute(input)).resolves.toBeUndefined();

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
        expect(userRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);

        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();
        expect(passwordCacheMock.save).not.toHaveBeenCalled();
    });

    it("Should not save code or send email if code generation fails", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(codeGeneratorServiceMock.generate)
            .mockImplementation(() => {
                throw new Error("Code generation failed");
            });

        await expect(requestForgotPasswordUseCase.execute(input)).rejects.toThrow("Code generation failed");

        expect(passwordCacheMock.save).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();
    });

    it("Should not send email if saving code fails", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(codeGeneratorServiceMock.generate).mockReturnValue("123456");

        vi.mocked(passwordCacheMock.save).mockRejectedValue(new Error("Cache unavailable"));

        await expect(requestForgotPasswordUseCase.execute(input)).rejects.toThrow("Cache unavailable");

        expect(mailServiceMock.send).not.toHaveBeenCalled();
    });

    it("Should propagate error if email sending fails", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(codeGeneratorServiceMock.generate).mockReturnValue("123456");

        vi.mocked(mailServiceMock.send).mockRejectedValue(new Error("Email sending failed"));

        await expect(requestForgotPasswordUseCase.execute(input)).rejects.toThrow("Email sending failed");

        expect(passwordCacheMock.save).toHaveBeenCalledTimes(1);
    });
});


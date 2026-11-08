import { describe, it, vi, expect, beforeEach } from "vitest";
import { ICodeGeneratorService } from "../../core/services/generate-code-service.interface.js";
import { IMailService } from "../../core/services/mail-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IPasswordCacheService } from "../../core/services/password-change-store-service.interface.js";
import { RequestForgotPasswordUseCase } from "./request-forgot-password.use-case.js";
import { User } from "../domain/entities/user.entity.js";

describe('Test Request Forgot password.', () => {

    let codeGeneratorServiceMock: ICodeGeneratorService;
    let mailServiceMock: IMailService;
    let userRepositoryMock: IUserRepository;
    let passwordCacheMock: IPasswordCacheService;
    let requestForgotPasswordUseCase: RequestForgotPasswordUseCase;

    const input = {
        email: 'paulo@gmail.com'
    }

    beforeEach(() => {
        codeGeneratorServiceMock = {
            generate: vi.fn()
        } as unknown as ICodeGeneratorService;

        mailServiceMock = {
            send: vi.fn()
        } as unknown as IMailService

        userRepositoryMock = {
            findByEmail: vi.fn()
        } as unknown as IUserRepository

        passwordCacheMock = {
            save: vi.fn()
        } as unknown as IPasswordCacheService

        requestForgotPasswordUseCase = new RequestForgotPasswordUseCase(
            codeGeneratorServiceMock,
            mailServiceMock,
            passwordCacheMock,
            userRepositoryMock
        );
    });

    it("Should verify is email exist, generate code, send email and save new password in cache.", async () => {

        const user = User.restore('1234-abc', 'paulo@gmail.com', "Paulo", "05562954559", "qwerty-a-12345", new Date, new Date);

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(codeGeneratorServiceMock.generate).mockReturnValue("123456");

        await requestForgotPasswordUseCase.execute(input);

        expect(codeGeneratorServiceMock.generate).toHaveBeenCalledOnce();
        expect(mailServiceMock.send).toHaveBeenCalledWith(
            input.email,
            "Seu código de confirmação.", `Seu código de confirmação é ${"123456"}.`
        );
        expect(passwordCacheMock.save).toHaveBeenCalledWith(user.id.value, "123456", 300);
    });

    it("Should return silently and not execute services if email doesn't exist in database..", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);

        await expect(requestForgotPasswordUseCase.execute(input)).resolves.toBeUndefined();

        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();
        expect(passwordCacheMock.save).not.toHaveBeenCalled();
    });
});


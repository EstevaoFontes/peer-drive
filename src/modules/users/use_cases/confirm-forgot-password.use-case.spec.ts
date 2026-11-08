import { IPasswordCacheService } from "../../core/services/password-change-store-service.interface.js";
import { IHashService } from "../../core/services/password-hash-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { ConfirmForgotPasswordUseCase } from "./confirm-forgot-password.use-case.js";
import { User } from "../domain/entities/user.entity.js";
import { describe, it, vi, expect, beforeEach } from "vitest";

describe("Test Confirm Forgot Password", () => {
    let passwordCacheServiceMock: IPasswordCacheService;
    let hashServiceMock: IHashService;
    let userRepositoryMock: IUserRepository;
    let confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase;

    const input = {
        code: "123456",
        email: 'paulo@gmail.com',
        newPassword: "teste123",
        confirmNewPassword: "teste123"
    };

    const user = User.restore('1234-abc', 'paulo@gmail.com', "Paulo", "05562954559", "qwerty-a-12345", new Date, new Date);


    beforeEach(() => {
        passwordCacheServiceMock = {
            verifyById: vi.fn(),
            remove: vi.fn()
        } as unknown as IPasswordCacheService

        hashServiceMock = {
            hash: vi.fn()
        } as unknown as IHashService

        userRepositoryMock = {
            findByEmail: vi.fn(),
            update: vi.fn()
        } as unknown as IUserRepository

        confirmForgotPasswordUseCase = new ConfirmForgotPasswordUseCase(
            passwordCacheServiceMock,
            hashServiceMock,
            userRepositoryMock
        )
    });


    it('Should compare password, get user in database, get cache and compare, hash password, save in database and remove cache',
        async () => {

            vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

            vi.mocked(passwordCacheServiceMock.verifyById).mockResolvedValue({ code: "123456" });

            vi.mocked(hashServiceMock.hash).mockResolvedValue("hashed_password_123")

            await confirmForgotPasswordUseCase.execute(input);

            expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
            expect(passwordCacheServiceMock.remove).toHaveBeenCalledWith(user.id.value);
            expect(hashServiceMock.hash).toHaveBeenCalledWith(input.newPassword);
        });

    it('Should throw error if passwords is not equal.', async () => {

        const invalidInput = {
            ...input,
            confirmNewPassword: "teste12"
        };


        await expect(confirmForgotPasswordUseCase.execute(invalidInput)).rejects.toThrow("As senhas devem ser iguais.");

        expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
        expect(passwordCacheServiceMock.verifyById).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
        expect(passwordCacheServiceMock.remove).not.toHaveBeenCalled();
    })

    it("Sholud throw error if email not found.", async () => {



        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);

        await expect(confirmForgotPasswordUseCase.execute(input)).rejects.toThrow("Código inválido ou expirado.");

        expect(passwordCacheServiceMock.verifyById).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
        expect(passwordCacheServiceMock.remove).not.toHaveBeenCalled();
    });

    it("Should throw error if cache not found or expired.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(passwordCacheServiceMock.verifyById).mockResolvedValue(null);

        await expect(confirmForgotPasswordUseCase.execute(input)).rejects.toThrow("Código inválido ou expirado.");


        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
        expect(passwordCacheServiceMock.remove).not.toHaveBeenCalled();
    });

    it("Should throw error if codes is not equal.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(passwordCacheServiceMock.verifyById).mockResolvedValue({ code: '12345678' });

        await expect(confirmForgotPasswordUseCase.execute(input)).rejects.toThrow("Código inválido ou expirado.");


        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
        expect(passwordCacheServiceMock.remove).not.toHaveBeenCalled();
    });
});


import { IPasswordCacheService } from "../../core/services/password-change-cache-service.interface.js";
import { IHashService } from "../../core/services/password-hash-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { ConfirmForgotPasswordUseCase } from "./confirm-forgot-password.use-case.js";
import { User } from "../domain/entities/user.entity.js";
import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";

describe("Test Confirm Forgot Password", () => {

    type IPasswordCacheServiceMock = Mocked<IPasswordCacheService>
    type IHashServiceMock = Mocked<IHashService>
    type IUserRepositoryMock = Mocked<IUserRepository>


    let passwordCacheServiceMock: IPasswordCacheServiceMock;
    let hashServiceMock: IHashServiceMock;
    let userRepositoryMock: IUserRepositoryMock;
    let confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase;
    let user: User

    const input = {
        code: "123456",
        email: 'paulo@gmail.com',
        newPassword: "teste123",
        confirmNewPassword: "teste123"
    };

    const createUser = () => User.restore(
        '1234-abc',
        'teste@gmail.com',
        "John",
        "54587419516",
        "qwerty-a-12345",
        new Date(),
        new Date()
    );


    beforeEach(() => {
        passwordCacheServiceMock = {
            consumeCode: vi.fn(),
            save: vi.fn()
        }

        hashServiceMock = {
            hash: vi.fn(),
            compare: vi.fn()
        }

        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        }

        user = createUser()

        confirmForgotPasswordUseCase = new ConfirmForgotPasswordUseCase(
            passwordCacheServiceMock,
            hashServiceMock,
            userRepositoryMock
        )
    });


    it('Should compare password, get user in database, get cache, hash password and save in database.',
        async () => {

            vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

            vi.mocked(passwordCacheServiceMock.consumeCode).mockResolvedValue(true);

            vi.mocked(hashServiceMock.hash).mockResolvedValue("hashed_password_123")

            await confirmForgotPasswordUseCase.execute(input);

            expect(hashServiceMock.hash).toHaveBeenCalledWith(input.newPassword);
            expect(user.passwordValue).toBe("hashed_password_123")
            expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
            expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
        });



    it('Should throw error if passwords have less than 6 characters.', async () => {

        const invalidInput = {
            ...input,
            newPassword: "test"
        };


        await expect(confirmForgotPasswordUseCase.execute(invalidInput)).rejects.toThrow("A senha não pode ser menor que 6 caracteres.");

        expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
        expect(passwordCacheServiceMock.consumeCode).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(user.passwordValue).toBe("qwerty-a-12345")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });


    it('Should throw error if passwords is not equal.', async () => {

        const invalidInput = {
            ...input,
            confirmNewPassword: "teste12"
        };


        await expect(confirmForgotPasswordUseCase.execute(invalidInput)).rejects.toThrow("As senhas devem ser iguais.");

        expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
        expect(passwordCacheServiceMock.consumeCode).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(user.passwordValue).toBe("qwerty-a-12345")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Sholud throw error if email not found.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);

        await expect(confirmForgotPasswordUseCase.execute(input)).rejects.toThrow("Código inválido ou expirado.");

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
        expect(passwordCacheServiceMock.consumeCode).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(user.passwordValue).toBe("qwerty-a-12345")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if cache not found or expired.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(passwordCacheServiceMock.consumeCode).mockResolvedValue(false);

        await expect(confirmForgotPasswordUseCase.execute(input)).rejects.toThrow("Código inválido ou expirado.");

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
        expect(passwordCacheServiceMock.consumeCode).toHaveBeenCalledWith(user.id.value, input.code);

        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(user.passwordValue).toBe("qwerty-a-12345")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if hash is empty.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(passwordCacheServiceMock.consumeCode).mockResolvedValue(true);

        vi.mocked(hashServiceMock.hash).mockResolvedValue('');

        await expect(confirmForgotPasswordUseCase.execute(input)).rejects.toThrow("O hash da senha não pode ser vazio.");

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
        expect(passwordCacheServiceMock.consumeCode).toHaveBeenCalledWith(user.id.value, input.code);
        expect(hashServiceMock.hash).toHaveBeenCalledWith(input.newPassword);

        expect(user.passwordValue).toBe("qwerty-a-12345")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });
});


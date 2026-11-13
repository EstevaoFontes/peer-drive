import { IHashService } from "../../core/services/password-hash-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { ITokenService } from "../../core/services/token-service.interface.js";
import { ChangePasswordUseCase } from "./change-password.use-case.js";
import { describe, it, vi, beforeEach, expect, type Mocked } from "vitest";
import { User } from "../domain/entities/user.entity.js";

describe("Test change password.", () => {

    type IHashServiceMock = Mocked<IHashService>;
    type IUserRepositoryMock = Mocked<IUserRepository>;
    type ITokenServiceMock = Mocked<ITokenService>;

    let hashServiceMock: IHashServiceMock;
    let userRepositoryMock: IUserRepositoryMock;
    let tokenServiceMock: ITokenServiceMock;
    let changePasswordUseCase: ChangePasswordUseCase;
    let user: User;

    const input = {
        actualPassword: "teste-123",
        newPassword: "nova-senha-123",
        confirmNewPassword: "nova-senha-123"
    };

    const recreateUser = () => User.restore({
        id: "123-abc",
        email: "teste@gmail.com",
        name: "John",
        cpf: "54587419516",
        isContractAccepted: true,
        password: "teste-123-hash",
        createdAt: new Date(),
        updatedAt: new Date()
    });

    beforeEach(() => {
        hashServiceMock = {
            compare: vi.fn(),
            hash: vi.fn()
        };

        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        };

        tokenServiceMock = {
            generate: vi.fn(),
            verify: vi.fn()
        };

        user = recreateUser();

        changePasswordUseCase = new ChangePasswordUseCase(userRepositoryMock, hashServiceMock, tokenServiceMock);
    });

    it("Should verify token, get user by ID, compare password, change password and update in database.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        vi.mocked(hashServiceMock.compare)
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false);

        vi.mocked(hashServiceMock.hash).mockResolvedValue("abc-852-qwe");

        await changePasswordUseCase.execute("abc-cde-1234", input);

        expect(user.passwordValue).toBe("abc-852-qwe");
        expect(tokenServiceMock.verify).toHaveBeenCalledWith("abc-cde-1234");
        expect(userRepositoryMock.findById).toHaveBeenCalledWith("123-abc");

        expect(hashServiceMock.compare).toHaveBeenNthCalledWith(
            1,
            input.actualPassword,
            "teste-123-hash"
        );

        expect(hashServiceMock.compare).toHaveBeenNthCalledWith(
            2,
            input.newPassword,
            "teste-123-hash"
        );

        expect(hashServiceMock.hash).toHaveBeenCalledWith(input.newPassword);
        expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
        expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if password is not equal.", async () => {

        const inputNewPasswordDifferent = {
            ...input,
            confirmNewPassword: "senha-diferente"
        };

        await expect(changePasswordUseCase.execute("abc-cde-1234", inputNewPasswordDifferent)).rejects.toThrow("As senhas devem ser iguais.");

        expect(user.passwordValue).toBe("teste-123-hash");
        expect(tokenServiceMock.verify).not.toHaveBeenCalled();
        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(hashServiceMock.compare).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if token return null.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);


        await expect(changePasswordUseCase.execute("abc-cde-1234", input)).rejects.toThrow("Houve um erro ao te autenticar, tente novamente mais tarde.");

        expect(user.passwordValue).toBe("teste-123-hash");
        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(hashServiceMock.compare).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if user return null", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

        await expect(changePasswordUseCase.execute("abc-cde-1234", input)).rejects.toThrow("Houve um erro, por favor tente novamente mais tarde.");

        expect(user.passwordValue).toBe("teste-123-hash");
        expect(hashServiceMock.compare).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if verification password in database and input is not equal.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        vi.mocked(hashServiceMock.compare).mockResolvedValue(false);

        await expect(changePasswordUseCase.execute("abc-cde-1234", input)).rejects.toThrow("Senha incorreta.");

        expect(user.passwordValue).toBe("teste-123-hash");
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });


    it("Should throw error if new password and password in database and input is equal.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        vi.mocked(hashServiceMock.compare)
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(true);

        await expect(changePasswordUseCase.execute("abc-cde-1234", input)).rejects.toThrow("A nova senha deve ser diferente da senha atual.");

        expect(user.passwordValue).toBe("teste-123-hash");
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if hash password is empty.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        vi.mocked(hashServiceMock.compare)
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false);

        vi.mocked(hashServiceMock.hash).mockResolvedValue("");


        await expect(changePasswordUseCase.execute("abc-cde-1234", input)).rejects.toThrow("O hash da senha não pode ser vazio.");

        expect(user.passwordValue).toBe("teste-123-hash");
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });
});
import { IHashService } from "../../core/services/password-hash-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { ITokenService } from "../../core/services/token-service.interface.js";
import { ChangePasswordUseCase } from "./change-password.use-case.js";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { User } from "../domain/entities/user.entity.js";

describe('Test change password.', () => {

    let hashServiceMock: IHashService;
    let userRepositoryMock: IUserRepository;
    let tokenServiceMock: ITokenService;
    let changePasswordUseCase: ChangePasswordUseCase;

    const input = {
        actualPassword: "teste-123",
        newPassword: "nova-senha-123",
        confirmNewPassword: "nova-senha-123"
    };

    const user = User.restore('123-abc', 'paulo@gmail.com', 'Paulo', '05562954559', 'teste-123-hash', new Date, new Date);

    beforeEach(() => {
        hashServiceMock = {
            compare: vi.fn(),
            hash: vi.fn()
        } as unknown as IHashService;

        userRepositoryMock = {
            findById: vi.fn(),
            update: vi.fn()
        } as unknown as IUserRepository;

        tokenServiceMock = {
            verify: vi.fn()
        } as unknown as ITokenService;


        changePasswordUseCase = new ChangePasswordUseCase(userRepositoryMock, hashServiceMock, tokenServiceMock);
    });

    it('Should verify token, get user by ID, compare password, change password and update in database.', async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: '123-abc',
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        vi.mocked(hashServiceMock.compare).mockResolvedValue(true);

        vi.mocked(hashServiceMock.hash).mockResolvedValue('abc-852-qwe')

        await changePasswordUseCase.execute('abc-cde-1234', input);

        expect(tokenServiceMock.verify).toHaveBeenCalledWith('abc-cde-1234');
        expect(userRepositoryMock.findById).toHaveBeenCalledWith('123-abc');
        expect(hashServiceMock.compare).toHaveBeenCalledWith(input.actualPassword, 'teste-123-hash');
        expect(hashServiceMock.hash).toHaveBeenCalledWith(input.newPassword);
        expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
    });

    it("Should throw error if password is not equal.", async () => {

        const inputNewPasswordDifferent = {
            ...input,
            confirmNewPassword: "senha-diferente"
        };

        await expect(changePasswordUseCase.execute('abc-cde-1234', inputNewPasswordDifferent)).rejects.toThrow("As senhas devem ser iguais.");

        expect(tokenServiceMock.verify).not.toHaveBeenCalled();
        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(hashServiceMock.compare).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled()
    });

    it("Should throw error if token return null.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);


        await expect(changePasswordUseCase.execute('abc-cde-1234', input)).rejects.toThrow("Houve um erro ao te autenticar, tente novamente mais tarde.");

        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(hashServiceMock.compare).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled()
    });

    it('Should throw error if user return null', async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: '123-abc',
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

        await expect(changePasswordUseCase.execute('abc-cde-1234', input)).rejects.toThrow("Houve um erro, por favor tente novamente mais tarde.");


        expect(hashServiceMock.compare).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled()
    });

    it("Should throw error if verification password in database and input is not equal.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: '123-abc',
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        vi.mocked(hashServiceMock.compare).mockResolvedValue(false);

        await expect(changePasswordUseCase.execute('abc-cde-1234', input)).rejects.toThrow("Senha incorreta.");

        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled()
    });
});
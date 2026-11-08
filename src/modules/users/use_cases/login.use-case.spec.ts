import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IHashService } from "../../core/services/password-hash-service.interface.js";
import { ITokenService } from "../../core/services/token-service.interface.js";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { User } from "../domain/entities/user.entity.js";
import { LoginUserUserCase } from "./login.use-case.js";

describe('Test Login User Use Case', () => {
    let userRepositoryMock: IUserRepository;
    let hashServiceMock: IHashService;
    let tokenServiceMock: ITokenService;
    let loginUserUseCase: LoginUserUserCase;

    const userDatabase = {
        id: "123456aabc",
        email: 'paulo@gmail.com',
        name: "Paulo",
        cpf: "055.629.545-59",
        password: "123-abc-456",
        createdAt: new Date(),
        updatedAt: new Date()
    }

    beforeEach(() => {

        userRepositoryMock = {
            findByEmail: vi.fn()
        } as unknown as IUserRepository;

        hashServiceMock = {
            compare: vi.fn()
        } as unknown as IHashService;

        tokenServiceMock = {
            generate: vi.fn()
        } as unknown as ITokenService;

        loginUserUseCase = new LoginUserUserCase(userRepositoryMock, hashServiceMock, tokenServiceMock)

    });

    it('Should search email and compare password and login user successful and return access token', async () => {

        const input = {
            email: "paulo@gmail.com",
            password: "teste123"
        };

        const recreateUser = User.restore(
            userDatabase.id,
            userDatabase.email,
            userDatabase.name,
            userDatabase.cpf,
            userDatabase.password,
            userDatabase.createdAt,
            userDatabase.updatedAt
        );

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(recreateUser);

        vi.mocked(hashServiceMock.compare).mockResolvedValue(true);

        vi.mocked(tokenServiceMock.generate).mockReturnValue('mocked-jwt-token')

        const login = await loginUserUseCase.execute(input);

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);

        expect(hashServiceMock.compare).toHaveBeenCalledWith(input.password, recreateUser.passwordValue);

        expect(tokenServiceMock.generate).toHaveBeenCalledWith(
            {
                userID: recreateUser.id.value,
                email: recreateUser.email.value
            });

        expect(login).toEqual({ accessToken: 'mocked-jwt-token' });

    });


    it("Should throw error if user doesn't exist", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null)

        const input = {
            email: "paulo@gmail.com",
            password: "teste123"
        };

        await expect(loginUserUseCase.execute(input)).rejects.toThrow('Email ou senha inválidos.')
        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith("paulo@gmail.com")

        expect(hashServiceMock.compare).not.toHaveBeenCalled()
        expect(tokenServiceMock.generate).not.toHaveBeenCalled()
    });

    it("Should throw error if passwords doesn't match.", async () => {

        const input = {
            email: "paulo@gmail.com",
            password: "teste123"
        };

        const recreateUser = User.restore(
            userDatabase.id,
            userDatabase.email,
            userDatabase.name,
            userDatabase.cpf,
            userDatabase.password,
            userDatabase.createdAt,
            userDatabase.updatedAt
        );

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(recreateUser);
        vi.mocked(hashServiceMock.compare).mockResolvedValue(false);


        await expect(loginUserUseCase.execute(input)).rejects.toThrow('Email ou senha inválidos.')

        expect(hashServiceMock.compare).toHaveBeenCalledWith(input.password, recreateUser.passwordValue)

        expect(tokenServiceMock.generate).not.toHaveBeenCalled()
    })
});
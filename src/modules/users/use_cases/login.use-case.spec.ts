import { describe, it, beforeEach, vi, expect, type Mocked } from "vitest";
import { User } from "../domain/entities/user.entity.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IHashService } from "../../core/services/password-hash-service.interface.js";
import { ITokenService } from "../../core/services/token-service.interface.js";
import { LoginUserUserCase } from "./login.use-case.js";

describe("Test Login User Use Case", () => {

    type IUserRepositoryMock = Mocked<IUserRepository>;
    type IHashServiceMock = Mocked<IHashService>;
    type ITokenServiceMock = Mocked<ITokenService>;


    let userRepositoryMock: IUserRepositoryMock;
    let hashServiceMock: IHashServiceMock;
    let tokenServiceMock: ITokenServiceMock;
    let loginUserUseCase: LoginUserUserCase;
    let user: User;

    const recreateUser = () => User.restore(
        "123456aabc",
        "john@gmail.com",
        "John",
        "54587419516",
        "123-abc-456",
        new Date(),
        new Date()
    );

    const input = {
        email: "john@gmail.com",
        password: "teste123"
    };

    beforeEach(() => {

        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()

        };

        hashServiceMock = {
            compare: vi.fn(),
            hash: vi.fn()
        };

        tokenServiceMock = {
            generate: vi.fn(),
            verify: vi.fn()
        };

        user = recreateUser();

        loginUserUseCase = new LoginUserUserCase(userRepositoryMock, hashServiceMock, tokenServiceMock);

    });

    it("Should login successful and return token.", async () => {


        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);

        vi.mocked(hashServiceMock.compare).mockResolvedValue(true);

        vi.mocked(tokenServiceMock.generate).mockResolvedValue("mocked-jwt-token");

        await loginUserUseCase.execute(input);

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);

        expect(hashServiceMock.compare).toHaveBeenCalledWith(input.password, user.passwordValue);

        expect(tokenServiceMock.generate).toHaveBeenCalledWith(
            {
                userID: user.id.value,
                email: user.email.value
            });

        expect(tokenServiceMock.generate).toHaveLastResolvedWith("mocked-jwt-token");

    });


    it("Should throw error if user doesn't exist", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);

        await expect(loginUserUseCase.execute(input)).rejects.toThrow("Email ou senha inválidos.");

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith("john@gmail.com");
        expect(hashServiceMock.compare).not.toHaveBeenCalled();
        expect(tokenServiceMock.generate).not.toHaveBeenCalled();
    });

    it("Should throw error if incorrect password.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);
        vi.mocked(hashServiceMock.compare).mockResolvedValue(false);


        await expect(loginUserUseCase.execute(input)).rejects.toThrow("Email ou senha inválidos.");

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith("john@gmail.com");
        expect(hashServiceMock.compare).toHaveBeenCalledWith(input.password, user.passwordValue);
        expect(tokenServiceMock.generate).not.toHaveBeenCalled();
    });

    it("Should throw error if have problem to generate token.", async () => {

        vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(user);
        vi.mocked(hashServiceMock.compare).mockResolvedValue(true);
        vi.mocked(tokenServiceMock.generate).mockResolvedValue(null);


        await expect(loginUserUseCase.execute(input)).rejects.toThrow("Houve um erro ao te autenticar, por favor tente novamente mais tarde.");

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith("john@gmail.com");
        expect(hashServiceMock.compare).toHaveBeenCalledWith(input.password, user.passwordValue);
        expect(tokenServiceMock.generate).toHaveBeenCalledWith({
            userID: user.id.value,
            email: user.email.value
        });
    });
});
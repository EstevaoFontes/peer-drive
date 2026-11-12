import { ITokenService } from "../../core/services/token-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { DeleteUserUseCase } from "./delte-user.use-case.js";
import { describe, it, vi, expect, type Mocked, beforeEach } from "vitest";

describe('Teste Delete User', () => {
    type ITokenServiceMock = Mocked<ITokenService>;
    type IUserRepositoryMock = Mocked<IUserRepository>;

    let tokenServiceMock: ITokenServiceMock;
    let userRepositoryMock: IUserRepositoryMock;
    let deleteUserUseCase: DeleteUserUseCase;

    const token = "ebc-def-123"

    beforeEach(() => {
        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        }

        tokenServiceMock = {
            generate: vi.fn(),
            verify: vi.fn()
        }

        deleteUserUseCase = new DeleteUserUseCase(tokenServiceMock, userRepositoryMock)
    });

    it("Should verify token and delete user.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "john@gmail.com"
        });

        vi.mocked(userRepositoryMock.delete).mockResolvedValue(true);

        await deleteUserUseCase.execute(token);

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("ebc-def-123");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.delete).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.delete).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if token expired or invalid.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(deleteUserUseCase.execute(token)).rejects.toThrow("Token inválido ou expirado.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("ebc-def-123");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.delete).not.toHaveBeenCalled();
    });

    it("Should throw an error if the user does not exist.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "john@gmail.com"
        });

        vi.mocked(userRepositoryMock.delete).mockResolvedValue(false);

        await expect(deleteUserUseCase.execute(token)).rejects.toThrow("Usuário não encontrado.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("ebc-def-123");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.delete).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.delete).toHaveBeenCalledTimes(1);
    })

});
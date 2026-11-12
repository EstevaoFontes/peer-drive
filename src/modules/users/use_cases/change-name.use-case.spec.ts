import { IUserRepository } from "../domain/repositories/user.repository.js";
import { ITokenService } from "../../core/services/token-service.interface.js";
import { ChangeUserNameUseCase } from "./change-name.use-case.js";
import { User } from "../domain/entities/user.entity.js";
import { describe, it, vi, beforeEach, expect, type Mocked } from "vitest";

describe("Test Change Name User Use Case", () => {

    type IUserRepositoryMock = Mocked<IUserRepository>;
    type ITokenServiceMock = Mocked<ITokenService>;

    let userRepositoryMock: IUserRepositoryMock;
    let tokenServiceMock: ITokenServiceMock;
    let changeUserNameUseCase: ChangeUserNameUseCase;
    let user: User;

    const input = {
        name: "Luke"
    };

    const createUser = () => User.restore("1234", "teste@gmail.com", "John", "54587419516", "123456-abc", new Date, new Date);

    beforeEach(() => {
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

        user = createUser();

        changeUserNameUseCase = new ChangeUserNameUseCase(userRepositoryMock, tokenServiceMock);
    });

    it("Should verify token, get user in database, change name and update user.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ userID: "abc-1234", email: "teste@gmail.com" });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await changeUserNameUseCase.execute("abc-123-cde", input);

        expect(user.name).toBe("Luke");
        expect(tokenServiceMock.verify).toHaveBeenCalledWith("abc-123-cde");
        expect(userRepositoryMock.findById).toHaveBeenCalledWith("abc-1234");
        expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
        expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);

    });

    it("Should throw error if token has error.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(changeUserNameUseCase.execute("abc-123-cde", input)).rejects.toThrow("Ocorreu um erro ao autenticar, tente novamente.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("abc-123-cde");
        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if user is not find.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ userID: "abc-1234", email: "teste@gmail.com" });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

        await expect(changeUserNameUseCase.execute("abc-123-cde", input)).rejects.toThrow("Ocorreu um erro, tente novamente.");

        expect(userRepositoryMock.findById).toHaveBeenCalledWith("abc-1234");
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if name has less than 3 characters.", async () => {

        const rejectInput = {
            ...input,
            name: "Lu"
        };

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ userID: "abc-1234", email: "teste@gmail.com" });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await expect(changeUserNameUseCase.execute("abc-123-cde", rejectInput)).rejects.toThrow("O nome não pode ter menos de 3 caracteres.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("abc-123-cde");
        expect(userRepositoryMock.findById).toHaveBeenCalledWith("abc-1234");
        expect(user.name).toBe("John");
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if name in database and input name is qual.", async () => {

        const rejectInput = {
            ...input,
            name: "John"
        };

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ userID: "abc-1234", email: "teste@gmail.com" });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await expect(changeUserNameUseCase.execute("abc-123-cde", rejectInput)).rejects.toThrow("Os nomes não podem ser iguais.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("abc-123-cde");
        expect(userRepositoryMock.findById).toHaveBeenCalledWith("abc-1234");
        expect(user.name).toBe("John");
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });
});
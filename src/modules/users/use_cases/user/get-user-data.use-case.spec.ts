import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { ITokenService } from "../../../core/services/token-service.interface.js";
import { GetUserDataUseCase } from "./get-user-data.use-case.js";
import { describe, it, vi, expect, type Mocked, beforeEach } from "vitest";
import { User } from "../../domain/entities/user.entity.js";

describe("Test request get data to user.", () => {

    type IUserRepositoryMock = Mocked<IUserRepository>;
    type ITokenServiceMock = Mocked<ITokenService>;

    let userRepositoryMock: IUserRepositoryMock;
    let tokenServiceMock: ITokenServiceMock;
    let getUserDataUseCase: GetUserDataUseCase;
    let user: User;

    const recreateUser = () => User.restore({
        id: "123-abc",
        email: "teste@gmail.com",
        name: "John",
        cpf: "54587419516",
        phoneNumber: "11987654321",
        isContractAccepted: true,
        password: "teste-123-hash",
        createdAt: new Date(),
        updatedAt: new Date(),
        driverLicense: undefined
    });

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

        user = recreateUser();

        getUserDataUseCase = new GetUserDataUseCase(tokenServiceMock, userRepositoryMock);
    });

    it("Should get user in database e return data.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        const result = await getUserDataUseCase.execute("abc-123-465");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("abc-123-465");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            email: user.email.value,
            name: user.name,
            cpf: user.cpf.value,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });



    });

    it("Should throw error if token expired or bad formatted.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(getUserDataUseCase.execute("123-asd-vadads"))
            .rejects
            .toThrow("Houve um erro, tente novamente mais tarde.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findById).not.toHaveBeenCalled();

    });

    it("Should throw error if not find user.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

        await expect(getUserDataUseCase.execute("123-asd-vadads"))
            .rejects
            .toThrow("Houve um erro, tente novamente mais tarde.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);
    });
});
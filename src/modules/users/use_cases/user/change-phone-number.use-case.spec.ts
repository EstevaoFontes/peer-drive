import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { ITokenService } from "../../../core/services/token-service.interface.js";
import { ChangePhoneNumberUseCase } from "./change-phone-number.use-case.js";
import { describe, it, vi, expect, type Mocked, beforeEach } from "vitest";
import { User } from "../../domain/entities/user.entity.js";

describe("Test Change phone number use case", () => {

    type IUserRepositoryMock = Mocked<IUserRepository>;
    type ITokenServiceMock = Mocked<ITokenService>;

    let userRepositoryMock: IUserRepositoryMock;
    let tokenServiceMock: ITokenServiceMock;
    let changePhoneNumberUseCase: ChangePhoneNumberUseCase;
    let user: User;

    const input = {
        newPhoneNumber: "71985208817"
    };

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

        changePhoneNumberUseCase = new ChangePhoneNumberUseCase(userRepositoryMock, tokenServiceMock);
    });

    it("Should change phone number", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await changePhoneNumberUseCase.execute("123-asd-vadads", input);

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);

        expect(user.phoneNumber).toBe("71985208817");

        expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
        expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);

    });

    it("Should throw error if token expired or bad formatted.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(changePhoneNumberUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("Houve um erro de autenticação, tente novamente mais tarde.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findById).not.toHaveBeenCalled();

        expect(user.phoneNumber).toBe("11987654321");

        expect(userRepositoryMock.update).not.toHaveBeenCalled();

    });

    it("Should throw error if not find user.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);

        await expect(changePhoneNumberUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("Houve um erro, tente novamente mais tarde.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);

        expect(user.phoneNumber).toBe("11987654321");

        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if new phone number is equal then actual phone number.", async () => {

        const wrongInput = {
            ...input,
            newPhoneNumber: "11987654321"
        };

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await expect(changePhoneNumberUseCase.execute("123-asd-vadads", wrongInput))
            .rejects
            .toThrow("O número novo deve ser diferente do atual.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findById).toHaveBeenCalledTimes(1);

        expect(user.phoneNumber).toBe("11987654321");

        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

});
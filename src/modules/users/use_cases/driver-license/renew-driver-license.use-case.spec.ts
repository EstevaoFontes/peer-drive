import { describe, it, vi, type Mocked, expect, beforeEach, afterEach } from "vitest";
import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { ITokenService } from "../../../core/services/token-service.interface.js";
import { RenewDriverLicenseUseCase } from "./renew-driver-license.use-case.js";
import { User } from "../../domain/entities/user.entity.js";
import { UserId } from "../../domain/value-objects/id-create.value-objects.js";
import { DriverLicense } from "../../domain/value-objects/drive-license.value-objects.js";
import { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";

describe("Test renew Driver License.", () => {

    type UserRepositoryMock = Mocked<IUserRepository>;
    type TokenServiceMock = Mocked<ITokenService>;

    let userRepositoryMock: UserRepositoryMock;
    let tokenServiceMock: TokenServiceMock;
    let renewDriverLicenseUseCase: RenewDriverLicenseUseCase;
    let user: User;
    let userWithDriverLicense: User;

    const input = {
        expirationDate: new Date("2032-11-17T12:00:00")
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
        driverLicense: null
    });

    const recreateUserWithDriverLicense = () => User.restore({
        id: "123-abc",
        email: "teste@gmail.com",
        name: "John",
        cpf: "54587419516",
        phoneNumber: "11987654321",
        isContractAccepted: true,
        password: "teste-123-hash",
        createdAt: new Date(),
        updatedAt: new Date(),
        driverLicense: DriverLicense.restore({
            userId: new UserId("123-abc"),
            registration: "98765432100",
            category: DriveLicenseCategory.AB,
            firstLicenseDate: new Date("2015-05-10T12:00:00"),
            expirationDate: new Date("2026-11-17T12:00:00")
        })
    });


    beforeEach(() => {
        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findByIdWithDriverLicense: vi.fn()
        };

        tokenServiceMock = {
            generate: vi.fn(),
            verify: vi.fn()
        };

        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-17T12:00:00"));

        user = recreateUser();

        userWithDriverLicense = recreateUserWithDriverLicense();

        renewDriverLicenseUseCase = new RenewDriverLicenseUseCase(tokenServiceMock, userRepositoryMock);
    });

    afterEach(() => {
        vi.useRealTimers();
    });


    it("Should renew expiration date in Drive License.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(userWithDriverLicense);

        await renewDriverLicenseUseCase.execute("123-asd-vadads", input);

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(userWithDriverLicense.driverLicense?.expirationDate).toEqual(input.expirationDate);

        expect(userRepositoryMock.update).toHaveBeenCalledWith(userWithDriverLicense);
        expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);

    });

    it("Should throw error if token expired or bad formatted.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(renewDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("Ocorreu um erro, tente novamente.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).not.toHaveBeenCalled();

        expect(userRepositoryMock.update).not.toHaveBeenCalled();

    });


    it("Should throw error if not find user.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(null);


        await expect(renewDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("Usuário não encontrado.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if driver license is null.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(user);


        await expect(renewDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("O usuário não possui uma CNH cadastrada.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if driver license is undefined.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        const recreateUserWithoutLoadedDriverLicense = User.restore({
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

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(recreateUserWithoutLoadedDriverLicense);


        await expect(renewDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("A CNH precisa ser carregada para realizar esta operação.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.update).not.toHaveBeenCalled();

    });

    it("should throw an error if the expiration date is more than 3 days away", async () => {

        const userWithExpirationDateMoreThan3DaysAway = User.restore({
            id: "123-abc",
            email: "teste@gmail.com",
            name: "John",
            cpf: "54587419516",
            phoneNumber: "11987654321",
            isContractAccepted: true,
            password: "teste-123-hash",
            createdAt: new Date(),
            updatedAt: new Date(),
            driverLicense: DriverLicense.restore({
                userId: new UserId("123-abc"),
                registration: "98765432100",
                category: DriveLicenseCategory.AB,
                firstLicenseDate: new Date("2015-05-10T12:00:00"),
                expirationDate: new Date("2026-11-22T12:00:00")
            })
        });

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"

        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(userWithExpirationDateMoreThan3DaysAway);

        await expect(renewDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("A renovação só pode ser realizada quando faltarem 3 dias ou menos para o vencimento.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if new data expiration is equal than actual data expiration.", async () => {

        const inputSameDate = {
            expirationDate: new Date("2026-11-17T12:00:00")
        };

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"

        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(userWithDriverLicense);

        await expect(renewDriverLicenseUseCase.execute("123-asd-vadads", inputSameDate))
            .rejects
            .toThrow("A nova data de expiração deve ser posterior à data atual.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });
});
import { describe, it, vi, type Mocked, expect, beforeEach } from "vitest";
import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { ITokenService } from "../../../core/services/token-service.interface.js";
import { CreateDriverLicenseUseCase } from "./create-driver-license.use-case.js";
import { User } from "../../domain/entities/user.entity.js";
import { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";
import { DriverLicense } from "../../domain/value-objects/drive-license.value-objects.js";
import { UserId } from "../../domain/value-objects/id-create.value-objects.js";

describe("Test Create Driver License Use Case.", () => {

    type UserRepositoryMock = Mocked<IUserRepository>;
    type TokenServiceMock = Mocked<ITokenService>;

    let userRepositoryMock: UserRepositoryMock;
    let tokenServiceMock: TokenServiceMock;
    let createDriverLicenseUseCase: CreateDriverLicenseUseCase;
    let user: User;
    let userWithDriverLicense: User;

    const input = {
        registration: "12345678901",
        category: DriveLicenseCategory.AB,
        firstLicenseDate: new Date("2018-05-10T12:00:00"),
        expirationDate: new Date("2028-05-10T12:00:00")
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
            category: DriveLicenseCategory.B,
            firstLicenseDate: new Date("2015-05-10T12:00:00"),
            expirationDate: new Date("2028-05-10T12:00:00")
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

        user = recreateUser();

        userWithDriverLicense = recreateUserWithDriverLicense();

        createDriverLicenseUseCase = new CreateDriverLicenseUseCase(tokenServiceMock, userRepositoryMock);
    });

    it("Should Create Driver License Instance.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(user);

        vi.spyOn(user, "addDriverLicense");

        await createDriverLicenseUseCase.execute("123-asd-vadads", input);

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(user.addDriverLicense).toHaveBeenCalledWith(input);
        expect(user.driverLicense).toStrictEqual({
            registration: "12345678901",
            category: DriveLicenseCategory.AB,
            firstLicenseDate: new Date("2018-05-10T12:00:00"),
            expirationDate: new Date("2028-05-10T12:00:00")
        });

        expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
        expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
    });

    it("Should throw error if token expired or bad formatted.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        vi.spyOn(user, "addDriverLicense");

        await expect(createDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("Houve um erro de autenticação, tente novamente mais tarde.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).not.toHaveBeenCalled();
        expect(user.addDriverLicense).not.toHaveBeenCalled();

        expect(userRepositoryMock.update).not.toHaveBeenCalled();

    });

    it("Should throw error if not find user.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(null);

        vi.spyOn(user, "addDriverLicense");

        await expect(createDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("Houve um erro, tente novamente mais tarde.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if driver license alredy exist.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(userWithDriverLicense);

        vi.spyOn(userWithDriverLicense, "addDriverLicense");

        await expect(createDriverLicenseUseCase.execute("123-asd-vadads", input))
            .rejects
            .toThrow("Carteira de motorista já cadastrada.");

        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");

        expect(userWithDriverLicense.addDriverLicense).toHaveBeenCalledWith(input);
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });


});
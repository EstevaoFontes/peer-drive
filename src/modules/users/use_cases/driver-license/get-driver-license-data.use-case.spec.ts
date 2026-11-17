import { describe, it, vi, type Mocked, expect, beforeEach } from "vitest";
import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { ITokenService } from "../../../core/services/token-service.interface.js";
import { GetDriverLicenseDataUseCase } from "./get-driver-license-data.use-case.js";
import { User } from "../../domain/entities/user.entity.js";
import { DriverLicense } from "../../domain/value-objects/drive-license.value-objects.js";
import { UserId } from "../../domain/value-objects/id-create.value-objects.js";
import { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";

describe("Test GET data to Driver License.", () => {

    type UserRepositoryMock = Mocked<IUserRepository>;
    type TokenServiceMock = Mocked<ITokenService>;

    let userRepositoryMock: UserRepositoryMock;
    let tokenServiceMock: TokenServiceMock;
    let getDriverLicenseDataUseCase: GetDriverLicenseDataUseCase;
    let user: User;
    let userWithDriverLicense: User;

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

        getDriverLicenseDataUseCase = new GetDriverLicenseDataUseCase(tokenServiceMock, userRepositoryMock);
    });


    it("Should GET data to Driver License.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(userWithDriverLicense);

        const result = await getDriverLicenseDataUseCase.execute("123-asd-vadads");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            registration: "98765432100",
            category: DriveLicenseCategory.AB,
            firstLicenseDate: new Date("2015-05-10T12:00:00"),
            expirationDate: new Date("2028-05-10T12:00:00")
        });

    });


    it("Should throw error if token expired or bad formatted.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(getDriverLicenseDataUseCase.execute("123-asd-vadads"))
            .rejects
            .toThrow("Ocorreu um erro, tente novamente.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).not.toHaveBeenCalled();

    });

    it("Should throw error if not find user.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(null);


        await expect(getDriverLicenseDataUseCase.execute("123-asd-vadads"))
            .rejects
            .toThrow("Usuário não encontrado.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);
    });

    it("Should return null if data in the driver license do not exist.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123-abc",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.findByIdWithDriverLicense).mockResolvedValue(user);


        const result = await getDriverLicenseDataUseCase.execute("123-asd-vadads");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

        expect(result).toEqual(null);
    });

    it("Should throw error ir data in the driver license is undefined.", async () => {

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


        await expect(getDriverLicenseDataUseCase.execute("123-asd-vadads"))
            .rejects
            .toThrow("A CNH não foi carregada corretamente.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith("123-asd-vadads");
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledWith("123-abc");
        expect(userRepositoryMock.findByIdWithDriverLicense).toHaveBeenCalledTimes(1);

    });
});
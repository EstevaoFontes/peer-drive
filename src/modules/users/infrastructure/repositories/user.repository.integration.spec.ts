import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { UserRepository } from "./user.repository.js";
import { sequelize } from "../../../core/infrastructure/database/sequelize.js";
import { User } from "../../domain/entities/user.entity.js";
import { DriverLicense } from "../../domain/value-objects/drive-license.value-objects.js";
import { UserModel } from "../model/User.model.js";
import { DriverLicenseModel } from "../model/DriverLicense.model.js";
import { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";


describe("Test User Repository Integration. ", () => {

    let userRepository: UserRepository;
    let user: User;

    const recreateUser = () => User.create({
        email: "john@gmail.com",
        name: "John",
        cpf: "54587419516",
        phoneNumber: "11987654321",
        password: "senha-teste",
        isContractAccepted: true,
    });

    beforeEach(async () => {
        await sequelize.query("TRUNCATE TABLE \"driverLicense\", \"users\" CASCADE");

        user = recreateUser();
        userRepository = new UserRepository(UserModel, DriverLicenseModel, sequelize);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("Should Create User and save in database.", async () => {

        await userRepository.create(user);


        const userInDatabase = await UserModel.findByPk(user.id.value);

        const driverLicenseInDatabase = await DriverLicenseModel.findByPk(user.id.value);

        expect(driverLicenseInDatabase).toBeNull();

        expect(userInDatabase).not.toBeNull();

        expect(userInDatabase).toMatchObject({
            id: user.id.value,
            email: user.email.value,
            name: user.name,
            cpf: user.cpf.value,
            phoneNumber: user.phoneNumber,
            password: user.password,
            isContractAccepted: user.isContractAccepted
        });
    });

    describe("Test to find Email and return boolean.", () => {

        it("Should Verify if User exist in Database.", async () => {

            await userRepository.create(user);

            const existEmail = await userRepository.existEmail(user.email.value);

            expect(existEmail).toBe(true);
        });

        it("Should Verify if User doesn't exist in Database.", async () => {

            const existEmail = await userRepository.existEmail("john@gmail.com");

            expect(existEmail).toBe(false);
        });
    });

    describe("Test to find User by Email and return User or null.", () => {

        it("Should Find User by Email and return User.", async () => {

            await userRepository.create(user);

            const findByEmail = await userRepository.findByEmail(user.email.value);

            expect(findByEmail).not.toBeNull();

            expect(findByEmail).toBeInstanceOf(User);

            expect(findByEmail!.id.value).toBe(user.id.value);
            expect(findByEmail!.email.value).toBe(user.email.value);
            expect(findByEmail!.cpf.value).toBe(user.cpf.value);

            expect(findByEmail!.name).toBe(user.name);
            expect(findByEmail!.phoneNumber).toBe(user.phoneNumber);
            expect(findByEmail!.password).toBe(user.password);
            expect(findByEmail!.isContractAccepted).toBe(user.isContractAccepted);
        });

        it("Should Find User by Email and return NULL", async () => {

            const findByEmail = await userRepository.findByEmail("john@gmail.com");

            expect(findByEmail).toBeNull();

            expect(findByEmail).toBe(null);

        });
    });


    describe("Test to find User by ID and return User or null.", () => {

        it("Should Find User by ID and return User.", async () => {

            await userRepository.create(user);

            const findById = await userRepository.findById(user.id.value);

            expect(findById).not.toBeNull();

            expect(findById).toBeInstanceOf(User);

            expect(findById!.id.value).toBe(user.id.value);
            expect(findById!.email.value).toBe(user.email.value);
            expect(findById!.cpf.value).toBe(user.cpf.value);

            expect(findById!.name).toBe(user.name);
            expect(findById!.phoneNumber).toBe(user.phoneNumber);
            expect(findById!.password).toBe(user.password);
            expect(findById!.isContractAccepted).toBe(user.isContractAccepted);
        });

        it("Should Find User by ID and return NULL", async () => {

            const findById = await userRepository.findById("6cf9f1bc-f821-45e4-b5ee-34e68ea32c4d");

            expect(findById).toBeNull();
        });
    });

    describe("Test to find User and Driver License or null.", () => {

        it("Should find User and Driver License.", async () => {

            await userRepository.create(user);

            user.addDriverLicense({
                registration: "123456789",
                category: DriveLicenseCategory.AC,
                firstLicenseDate: new Date(2020, 2, 10),
                expirationDate: new Date(2032, 2, 10),
            });

            await userRepository.update(user);

            const userFound = await userRepository.findByIdWithDriverLicense(user.id.value);

            expect(userFound).not.toBeNull();
            expect(userFound).toBeInstanceOf(User);

            expect(userFound!.driverLicense).toBeInstanceOf(DriverLicense);
            expect(userFound!.driverLicense!.registration).toBe("123456789");
            expect(userFound!.driverLicense!.category).toBe(DriveLicenseCategory.AC);
            expect(userFound!.driverLicense!.firstLicenseDate).toEqual(
                new Date(2020, 2, 10)
            );

            expect(userFound!.driverLicense!.expirationDate).toEqual(
                new Date(2032, 2, 10)
            );
        });

        it("Should find Driver License and return null.", async () => {

            await userRepository.create(user);

            const userFound = await userRepository.findByIdWithDriverLicense(user.id.value);

            expect(userFound).not.toBeNull();
            expect(userFound).toBeInstanceOf(User);

            expect(userFound!.driverLicense).toBeNull();

        });
    });

    it("Should update data in user.", async () => {

        await userRepository.create(user);

        user.changeName("Jason");
        user.changePhoneNumber("71985208817");
        user.changePassword("asdfposmdf-asdflkansdf-asdfasdf");
        user.changeEmail("jason@gmail.com");

        await userRepository.update(user);

        const userUpdated = await userRepository.findById(user.id.value);

        expect(userUpdated).not.toBeNull();
        expect(userUpdated).toBeInstanceOf(User);

        expect(userUpdated!.name).toEqual("Jason");

        expect(userUpdated!.phoneNumber).toEqual("71985208817");

        expect(userUpdated!.password).toEqual("asdfposmdf-asdflkansdf-asdfasdf");

        expect(userUpdated!.email.value).toEqual("jason@gmail.com");

    });

    it("Should delete user in database and return true.", async () => {

        await userRepository.create(user);

        const deleteUser = await userRepository.delete(user.id.value);

        const isDeleted = await UserModel.findByPk(user.id.value);

        expect(deleteUser).toBe(true);
        expect(isDeleted).toBeNull();
    });

    it("Should delete user and not find user in database and return false. ", async () => {

        const deleteUser = await userRepository.delete("9b364195-9378-40d2-a763-d08e1e3c6742");

        expect(deleteUser).toBe(false);
    });


});
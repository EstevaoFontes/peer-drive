import { it, describe, expect } from "vitest";
import { User } from "./user.entity.js";
import { Email } from "../value-objects/email-validate.value-objects.js";
import { UserId } from "../value-objects/id-create.value-objects.js";
import { Cpf } from "../value-objects/cpf-validate.value-objects.js";

describe("User entity", () => {

    const input = {
        email: "john@gmail.com",
        name: "John",
        cpf: "99101085425",
        password: "teste2",
        isContractAccepted: true
    };

    const userDatabase = {
        id: "123456aabc",
        email: "john@gmail.com",
        name: "John",
        cpf: "99101085425",
        password: "123-abc-456",
        isContractAccepted: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    describe("Create new user", () => {

        it("should create a valid user instance with auto-generated id and timestamps", () => {

            const user = User.create({
                email: input.email,
                name: input.name,
                cpf: input.cpf,
                isContractAccepted: input.isContractAccepted,
                password: input.password
            });

            expect(user).toBeInstanceOf(User);

            expect(user.id).toBeInstanceOf(UserId);
            expect(user.id).toBeDefined();
            expect(typeof user.id.value).toBe("string");
            expect(user.id.value.length).toBeGreaterThan(0);

            expect(user.email).toBeInstanceOf(Email);
            expect(user.email.value).toBe("john@gmail.com");

            expect(user.cpf).toBeInstanceOf(Cpf);
            expect(user.cpf.value).toBe("99101085425");
            expect(user.cpf.cpfFormatted()).toBe("991.010.854-25");

            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);

            const now = new Date().getTime();
            expect(user.createdAt.getTime()).toBeLessThanOrEqual(now);
        });
    });


    describe("Restore user.", () => {
        it("should be restore a user from database", () => {

            const restoreUser = User.restore({
                id: userDatabase.id,
                email: userDatabase.email,
                name: userDatabase.name,
                cpf: userDatabase.cpf,
                password: userDatabase.password,
                isContractAccepted: userDatabase.isContractAccepted,
                createdAt: userDatabase.createdAt,
                updatedAt: userDatabase.updatedAt
            });

            expect(restoreUser).toBeInstanceOf(User);
            expect(restoreUser.id).toBeInstanceOf(UserId);
            expect(typeof restoreUser.id.value).toBe("string");
            expect(restoreUser.id.value.length).toBeGreaterThan(0);

            expect(restoreUser.email).toBeInstanceOf(Email);
            expect(restoreUser.email.value).toBe("john@gmail.com");

            expect(restoreUser.cpf).toBeInstanceOf(Cpf);
            expect(restoreUser.cpf.value).toBe("99101085425");
            expect(restoreUser.cpf.cpfFormatted()).toBe("991.010.854-25");



        });
    });


    describe("Change Email.", () => {

        it("should change Email", () => {

            const user = User.create({
                email: "john@gmail.com",
                name: "John",
                cpf: "99101085425",
                isContractAccepted: true,
                password: "1234567"
            });

            const oldUpdatedAt = user.updatedAt;

            user.changeEmail("luke@gmail.com");

            expect(user.email.value).toBe("luke@gmail.com");

            expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());

        });

        it.each([

            {
                testCase: "Should throw error if no input new email",
                oldEmail: "john@gmail.com",
                newEmail: "",
                expectedError: "O email deve ser passado."
            },

            {
                testCase: "Should throw error if new email is equal a old email",
                oldEmail: "john@gmail.com",
                newEmail: "john@gmail.com",
                expectedError: "O novo email deve ser diferente do atual."
            },

            {
                testCase: "Should throw error if new email format is invalid",
                oldEmail: "john@gmail.com",
                newEmail: "INVALID-EMAIL",
                expectedError: "Formato de e-mail invalido."
            },

        ])("$testCase", ({ oldEmail, newEmail, expectedError }) => {

            const user = User.create({
                email: oldEmail,
                name: "John",
                cpf: "99101085425",
                isContractAccepted: true,
                password: "1234567"
            });


            expect(() => {
                user.changeEmail(newEmail);
            }).toThrow(expectedError);

        });
    });


    describe("Change password.", () => {

        it("should change password", () => {

            const user = User.create({
                email: "john@gmail.com",
                name: "John",
                cpf: "99101085425",
                isContractAccepted: true,
                password: "1234567"
            });

            const oldUpdatedAt = user.updatedAt;

            user.changePassword("12345678910");

            expect(user.passwordValue).toBe("12345678910");

            expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());

        });

        it("Should throw error if no input hash password", () => {

            const user = User.create({
                email: "john@gmail.com",
                name: "John",
                cpf: "99101085425",
                isContractAccepted: true,
                password: "old-password"
            });

            const newPassword = "";

            expect(() => user.changePassword(newPassword))
                .toThrow("O hash da senha não pode ser vazio.");
        });

    });
});


describe("Change name", () => {
    it("should change name", () => {

        const user = User.create({
            email: "john@gmail.com",
            name: "John",
            cpf: "99101085425",
            isContractAccepted: true,
            password: "1234567"
        });

        const oldUpdatedAt = user.updatedAt;

        user.changeName("Estevao");

        expect(user.name).toBe("Estevao");

        expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());

    });


    it.each([

        {
            testCase: "Should throw error if input has less then 3 characters",
            oldName: "Paulo",
            newName: "",
            expectedError: "O nome não pode ter menos de 3 caracteres."
        },

        {
            testCase: "Should throw error if old name and new name is equal",
            oldName: "Paulo",
            newName: "Paulo",
            expectedError: "Os nomes não podem ser iguais."
        },

    ])("$testCase", ({ oldName, newName, expectedError }) => {

        const user = User.create({
            email: "john@gmail.com",
            name: oldName,
            cpf: "99101085425",
            isContractAccepted: true,
            password: "1234567"
        });


        expect(() => {
            user.changeName(newName);
        }).toThrow(expectedError);

    });

});


describe("Should throw errors in creation.", () => {

    it.each([
        {
            testCase: "Should throw a Error when a name less then 3 characters.",
            email: "john@gmail.com",
            name: "Jo",
            cpf: "99101085425",
            isContractAccepted: true,
            password: "teste123",
            expectedError: "O nome não pode ter menos de 3 caracteres."
        },
        {
            testCase: "Should throw a Error when a name is empty.",
            email: "john@gmail.com",
            name: "",
            cpf: "99101085425",
            isContractAccepted: true,
            password: "teste123",
            expectedError: "O nome não pode ter menos de 3 caracteres."
        },
        {
            testCase: "Should throw a Error when an email it's bad formatted.",
            email: "johngmail.com",
            name: "John",
            cpf: "99101085425",
            isContractAccepted: true,
            password: "teste123",
            expectedError: "Formato de e-mail invalido."
        },
        {
            testCase: "Should throw a Error when an email is empty.",
            email: "",
            name: "John",
            cpf: "99101085425",
            isContractAccepted: true,
            password: "teste123",
            expectedError: "O e-mail não pode ser vazio."
        },
        {
            testCase: "Should throw a Error when an cpf it's bad formatted.",
            email: "john@gmail.com",
            name: "John",
            cpf: "000.000.000.00",
            isContractAccepted: true,
            password: "teste123",
            expectedError: "CPF invalido."
        },
        {
            testCase: "Should throw a Error when an cpf is empty.",
            email: "john@gmail.com",
            name: "John",
            cpf: "",
            isContractAccepted: true,
            password: "teste123",
            expectedError: "O CPF não pode ser vazio."
        },
        {
            testCase: "Should throw a Error when an password is empty.",
            email: "john@gmail.com",
            name: "John",
            cpf: "99101085425",
            isContractAccepted: true,
            password: "",
            expectedError: "A senha está mal formatada."
        },
        {
            testCase: "Should throw a Error when contract is not accepted.",
            email: "john@gmail.com",
            name: "John",
            cpf: "99101085425",
            isContractAccepted: false,
            password: "teste123",
            expectedError: "O contrato deve ser aceito"
        },
    ])("$testCase", ({ email, name, cpf, isContractAccepted, password, expectedError }) => {

        expect(() => {
            User.create({ email: email, name: name, cpf: cpf, isContractAccepted: isContractAccepted, password: password });
        }).toThrow(expectedError);

    });
});

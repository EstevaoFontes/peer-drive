import { it, describe, expect } from "vitest";
import { User } from "./user.entity.js";
import { Email } from "./value-objects/email-validate.value-objects.js";
import { UserId } from "./value-objects/id-create.value-objects.js";
import { Cpf } from "./value-objects/cpf-validate.value-objects.js";

describe('User entity', () => {

    const newUser = {
        email: 'paulo@gmail.com',
        name: "Paulo",
        cpf: "055.629.545-59",
        password: "teste2",
    }

    const userDatabase = {
        id: "123456aabc",
        email: 'paulo@gmail.com',
        name: "Paulo",
        cpf: "055.629.545-59",
    }

    describe('Create new user', () => {

        it('should create a valid user instance with auto-generated id and timestamps', () => {

            const user = User.create(newUser.email, newUser.name, newUser.cpf, newUser.password);

            expect(user).toBeInstanceOf(User);

            expect(user.id).toBeInstanceOf(UserId);
            expect(user.id).toBeDefined();
            expect(typeof user.id.value).toBe('string');
            expect(user.id.value.length).toBeGreaterThan(0);

            expect(user.email).toBeInstanceOf(Email);
            expect(user.email.value).toBe('paulo@gmail.com');

            expect(user.cpf).toBeInstanceOf(Cpf);
            expect(user.cpf.value).toBe("05562954559");
            expect(user.cpf.cpfFormatted()).toBe("055.629.545-59");

            expect(user.createdAt).toBeInstanceOf(Date);
            expect(user.updatedAt).toBeInstanceOf(Date);

            const now = new Date().getTime();
            expect(user.createdAt.getTime()).toBeLessThanOrEqual(now);
        })
    })


    describe('Restore user.', () => {
        it('should be restore a user from database', () => {

            const restoreUser = User.restore(userDatabase.id, userDatabase.email, userDatabase.name, userDatabase.cpf)

            expect(restoreUser).toBeInstanceOf(User);
            expect(restoreUser.id).toBeInstanceOf(UserId);
            expect(typeof restoreUser.id.value).toBe('string');
            expect(restoreUser.id.value.length).toBeGreaterThan(0);

            expect(restoreUser.email).toBeInstanceOf(Email);
            expect(restoreUser.email.value).toBe('paulo@gmail.com');

            expect(restoreUser.cpf).toBeInstanceOf(Cpf);
            expect(restoreUser.cpf.value).toBe("05562954559");
            expect(restoreUser.cpf.cpfFormatted()).toBe("055.629.545-59");



        })
    })


    describe('Should throw errors.', () => {

        it.each([
            {
                testCase: "Should throw a Error when a name less then 3 characters.",
                email: "pauloFontes@gmail.com",
                name: "Es",
                cpf: "055.629.545.59",
                password: "teste123",
                expectedError: 'O nome não pode ter menos de 3 caracteres.'
            },
            {
                testCase: "Should throw a Error when a name is empty.",
                email: "pauloFontes@gmail.com",
                name: "",
                cpf: "055.629.545.59",
                password: "teste123",
                expectedError: 'O nome não pode ter menos de 3 caracteres.'
            },
            {
                testCase: "Should throw a Error when an email it's bad formatted.",
                email: "pauloFontesgmail.com",
                name: "Estêvao Fontes",
                cpf: "055.629.545.59",
                password: "teste123",
                expectedError: 'Formato de e-mail invalido.'
            },
            {
                testCase: "Should throw a Error when an email is empty.",
                email: "",
                name: "Estêvao Fontes",
                cpf: "055.629.545.59",
                password: "teste123",
                expectedError: "O e-mail não pode ser vazio."
            },
            {
                testCase: "Should throw a Error when an cpf it's bad formatted.",
                email: "pauloFontes@gmail.com",
                name: "Estêvao Fontes",
                cpf: "000.000.000.00",
                password: "teste123",
                expectedError: 'CPF invalido.'
            },
            {
                testCase: "Should throw a Error when an cpf is empty.",
                email: "pauloFontes@gmail.com",
                name: "Estêvao Fontes",
                cpf: "",
                password: "teste123",
                expectedError: "O CPF não pode ser vazio."
            },
            {
                testCase: "Should throw a Error when an password is empty.",
                email: "pauloFontes@gmail.com",
                name: "Estêvao Fontes",
                cpf: "055.629.545.59",
                password: "",
                expectedError: 'A senha não pode ser menor que 6 caracteres.'
            },
            {
                testCase: "Should throw a Error when an password it's bad formated.",
                email: "pauloFontes@gmail.com",
                name: "Estêvao Fontes",
                cpf: "",
                password: "123",
                expectedError: 'A senha não pode ser menor que 6 caracteres.'
            }
        ])('testCase', ({ email, name, cpf, password, expectedError }) => {

            expect(() => {
                User.create(email, name, cpf, password);
            }).toThrow(expectedError);

        });
    });
});
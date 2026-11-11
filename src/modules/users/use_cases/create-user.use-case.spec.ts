import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { CreateUserUseCase } from "./create-user.use-case.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IHashService } from "../../core/services/password-hash-service.interface.js";
import { User } from "../domain/entities/user.entity.js";

describe('Test create User Use Case', () => {

    type IUserRepositoryMock = Mocked<IUserRepository>;
    type IHashServiceMock = Mocked<IHashService>;

    let userRepositoryMock: IUserRepositoryMock;
    let hashServiceMock: IHashServiceMock;
    let crateUserUseCase: CreateUserUseCase;

    const input = {
        name: "John Doe",
        email: "john@gmail.com",
        cpf: "54587419516",
        password: "nova-senha",
        confirmPassword: "nova-senha",
    };

    beforeEach(() => {

        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()

        }

        hashServiceMock = {
            compare: vi.fn(),
            hash: vi.fn()
        }

        crateUserUseCase = new CreateUserUseCase(userRepositoryMock, hashServiceMock);
    });

    it('Should successfully create user.', async () => {

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(false)
        vi.mocked(hashServiceMock.hash).mockResolvedValue("passord-hash")

        await crateUserUseCase.execute(input)

        expect(userRepositoryMock.existEmail).toHaveBeenCalledWith("john@gmail.com");
        expect(hashServiceMock.hash).toHaveBeenCalledWith("nova-senha");
        expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);

    });


    it('Should throw a Error if password is not equal.', async () => {

        const differentPasswordInput = {
            ...input,
            password: "senha-diferente"
        };

        await expect(crateUserUseCase.execute(differentPasswordInput)).rejects.toThrow('As senhas não são iguais.');

        expect(userRepositoryMock.existEmail).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });

    it("Should throw a error if email alredy exist", async () => {

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(true)

        await expect(crateUserUseCase.execute(input)).rejects.toThrow('Esse email ja está cadastrado.');

        expect(userRepositoryMock.existEmail).toHaveBeenCalledWith("john@gmail.com");
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });

    describe("Should throw errors if inputs is wrong.", () => {

        it.each([
            {
                testCase: "Should throw error if name is wrong.",
                name: "Jo",
                email: "john@gmail.com",
                cpf: "54587419516",
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "O nome não pode ter menos de 3 caracteres."
            },
            {
                testCase: "Should throw error if password is wrong.",
                name: "John",
                email: "john@gmail.com",
                cpf: "54587419516",
                password: "",
                confirmPassword: "",
                expectedError: "A senha está mal formatada."
            },

            {
                testCase: "Should throw error if email is bad formatted.",
                name: "John",
                email: "johngmail.com",
                cpf: "54587419516",
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "Formato de e-mail invalido."
            },

            {
                testCase: "Should throw error if email is empty.",
                name: "John",
                email: "",
                cpf: "54587419516",
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "O e-mail não pode ser vazio."
            },

            {
                testCase: "Should throw error if cpf is bad formatted.",
                name: "John",
                email: "john@gmail.com",
                cpf: "12345678912",
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "CPF invalido."
            },

            {
                testCase: "Should throw error if cpf is empty.",
                name: "John",
                email: "john@gmail.com",
                cpf: "",
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "O CPF não pode ser vazio."
            },
        ])('$testCase', async ({ name, email, cpf, password, confirmPassword, expectedError }) => {

            const wrongInput = {
                name: name,
                email: email,
                cpf: cpf,
                password: password,
                confirmPassword: confirmPassword
            }

            vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(false)
            vi.mocked(hashServiceMock.hash).mockResolvedValue(password)

            await expect(crateUserUseCase.execute(wrongInput)).rejects.toThrow(expectedError);

            expect(userRepositoryMock.existEmail).toHaveBeenCalledWith(email);
            expect(hashServiceMock.hash).toHaveBeenCalledWith(password);


            // expect(() => {
            //     crateUserUseCase.execute(wrongInput)
            // }).to.Throw(expectedError)
        });
    });
});
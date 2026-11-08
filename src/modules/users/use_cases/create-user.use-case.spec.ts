import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateUserUseCase } from "./create-user.use-case.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IHashService } from "../../core/services/password-hash-service.interface.js";

describe('Test create User Use Case', () => {

    let crateUserUseCase: CreateUserUseCase;
    let userRepositoryMock!: IUserRepository;
    let hashServiceMock!: IHashService;

    beforeEach(() => {

        userRepositoryMock = {
            existEmail: vi.fn(),
            create: vi.fn()
        } as unknown as IUserRepository;

        hashServiceMock = {
            hash: vi.fn().mockResolvedValue('password-hashed-123')
        } as unknown as IHashService;

        crateUserUseCase = new CreateUserUseCase(userRepositoryMock, hashServiceMock);
    });

    it('should successfully create a user when no invalid data is provided', async () => {

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(false)

        const input = {
            name: "Paulo Fontes",
            email: "paulo@gmail.com",
            cpf: "05562954559",
            password: "paulo123",
            confirmPassword: "paulo123",
        };

        await expect(crateUserUseCase.execute(input)).resolves.not.toThrow();

        expect(userRepositoryMock.existEmail).toHaveBeenCalledWith("paulo@gmail.com");
        expect(hashServiceMock.hash).toHaveBeenCalledWith("paulo123");
        expect(userRepositoryMock.create).toHaveBeenCalledOnce()

    })


    it('Should throw a Error if password being different', async () => {


        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(false)

        const input = {
            name: "Paulo Fontes",
            email: "paulo@gmail.com",
            cpf: "05562954559",
            password: "paulo123",
            confirmPassword: "Paulo123",
        };

        await expect(crateUserUseCase.execute(input)).rejects.toThrow('As senhas não são iguais.');

        expect(userRepositoryMock.existEmail).not.toHaveBeenCalled();
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).not.toHaveBeenCalled();


    });

    it("Should throw a error if email alredy exist", async () => {

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(true)

        const input = {
            name: "Paulo Fontes",
            email: "paulo@gmail.com",
            cpf: "05562954559",
            password: "paulo123",
            confirmPassword: "paulo123",
        };

        await expect(crateUserUseCase.execute(input)).rejects.toThrow('Esse email ja está cadastrado.');

        expect(userRepositoryMock.existEmail).toHaveBeenCalledWith("paulo@gmail.com");
        expect(hashServiceMock.hash).not.toHaveBeenCalled();
        expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });
});
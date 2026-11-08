import { ITokenService } from "../../core/services/token-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IMailChangeStore } from "../../core/services/mail-change-store-service.interface.js";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { ConfirmEmailChangeUseCase } from "./confirm-email-change.use-case.js";
import { User } from "../domain/entities/user.entity.js";

describe('Confirm Email Change Use Case.', () => {

    let tokenServiceMock: ITokenService;
    let userRepositoryMock: IUserRepository;
    let mailChangeStoreMock: IMailChangeStore;
    let confirmEmailChangeUseCaseMock: ConfirmEmailChangeUseCase;

    const input = {
        code: "12345",
        token: "123-abc",
        userId: "abc-123-def"
    };

    const userDatabase = User.restore(
        "123456aabc",
        'paulo@gmail.com',
        "Paulo",
        "05562954559",
        "123-abc-456",
        new Date(),
        new Date()
    );

    beforeEach(() => {
        tokenServiceMock = {
            verify: vi.fn()
        } as unknown as ITokenService;

        userRepositoryMock = {
            findById: vi.fn(),
            update: vi.fn()
        } as unknown as IUserRepository;

        mailChangeStoreMock = {
            verifyById: vi.fn(),
            remove: vi.fn()
        } as unknown as IMailChangeStore;

        confirmEmailChangeUseCaseMock = new ConfirmEmailChangeUseCase(userRepositoryMock, mailChangeStoreMock, tokenServiceMock);
    });

    it("Should verify (token, code), search user in database and update new email and clear cache.", async () => {

        const tokenExtracted = {
            email: "paulo@gmail.com",
            userId: "abc-123-def"
        };


        vi.mocked(tokenServiceMock.verify).mockReturnValue({
            userID: "abc-123-def",
            email: "paulo@gmail.com"
        });

        vi.mocked(mailChangeStoreMock.verifyById).mockResolvedValue({ newEmail: "estevao@gmail.com", code: "12345" });

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(userDatabase)

        await confirmEmailChangeUseCaseMock.execute(input);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith(tokenExtracted.userId);
        expect(userRepositoryMock.update).toHaveBeenCalledWith(userDatabase);
        expect(mailChangeStoreMock.remove).toHaveBeenCalledWith(tokenExtracted.userId);

    });

    describe('Test throw error in Token.', () => {
        it.each([
            {
                testCase: 'Should throw error if ID in token has empty',
                userID: '',
                email: 'paulo.fontes@gmail.com',
                expectedError: "Token inválido ou expirado."
            },

            {
                testCase: 'Should throw error if email in token has empty',
                userID: "abc-123-def",
                email: '',
                expectedError: "Token inválido ou expirado."
            },
        ])('$testCase', async ({ userID, email, expectedError }) => {

            vi.mocked(tokenServiceMock.verify).mockReturnValue({
                userID: userID,
                email: email
            });

            await expect(confirmEmailChangeUseCaseMock.execute(input)).rejects.toThrow((expectedError))

            expect(mailChangeStoreMock.verifyById).not.toHaveBeenCalled();
            expect(userRepositoryMock.findById).not.toHaveBeenCalled();
            expect(userRepositoryMock.update).not.toHaveBeenCalled();
            expect(mailChangeStoreMock.remove).not.toHaveBeenCalled();

        });
    })

    it("Should throw error if ID user is different ID in cache.", async () => {

        vi.mocked(tokenServiceMock.verify).mockReturnValue({
            userID: "def-456-acb",
            email: "paulo.fontes@gmail.com"
        });

        await expect(confirmEmailChangeUseCaseMock.execute(input)).rejects.toThrow(("Houve um erro, tente novamente."))

        expect(mailChangeStoreMock.verifyById).not.toHaveBeenCalled();
        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
        expect(mailChangeStoreMock.remove).not.toHaveBeenCalled();
    });


    it("Should throw error if cache is empty", async () => {

        vi.mocked(tokenServiceMock.verify).mockReturnValue({
            userID: "abc-123-def",
            email: "paulo@gmail.com"
        });

        vi.mocked(mailChangeStoreMock.verifyById).mockResolvedValue(null);

        await expect(confirmEmailChangeUseCaseMock.execute(input)).rejects.toThrow(("Código inválido ou expirado."))

        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
        expect(mailChangeStoreMock.remove).not.toHaveBeenCalled();

    });


    it('Should throw error if codes is different.', async () => {


        vi.mocked(tokenServiceMock.verify).mockReturnValue({
            userID: "abc-123-def",
            email: "paulo@gmail.com"
        });

        vi.mocked(mailChangeStoreMock.verifyById).mockResolvedValue({ newEmail: "estevao@gmail.com", code: "1234567" });


        await expect(confirmEmailChangeUseCaseMock.execute(input)).rejects.toThrow(("Código inválido ou expirado."));

        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
        expect(mailChangeStoreMock.remove).not.toHaveBeenCalled();
    });

});
import { ITokenService } from "../../core/services/token-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { ICodeGeneratorService } from "../../core/services/generate-code-service.interface.js";
import { IMailChangeStore } from "../../core/services/mail-change-store-service.interface.js";
import { IMailService } from "../../core/services/mail-service.interface.js";
import { RequestEmailChangeUseCase } from "./request-email-chenge.use-case.js";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe('Test request mail change use case.', () => {

    let tokenServiceMock: ITokenService;
    let userRepositoryMock: IUserRepository;
    let mailChangeStoreMock: IMailChangeStore;
    let codeGeneratorServiceMock: ICodeGeneratorService;
    let mailServiceMock: IMailService
    let requestEmailUseCase: RequestEmailChangeUseCase;

    beforeEach(() => {

        tokenServiceMock = {
            verify: vi.fn()
        } as unknown as ITokenService;

        userRepositoryMock = {
            existEmail: vi.fn()
        } as unknown as IUserRepository;

        mailChangeStoreMock = {
            save: vi.fn()
        } as unknown as IMailChangeStore;

        codeGeneratorServiceMock = {
            generate: vi.fn()
        } as unknown as ICodeGeneratorService;

        mailServiceMock = {
            send: vi.fn()
        } as unknown as IMailService

        requestEmailUseCase = new RequestEmailChangeUseCase(
            tokenServiceMock,
            userRepositoryMock,
            mailServiceMock,
            codeGeneratorServiceMock,
            mailChangeStoreMock
        );
    });


    it('Should receive new email, if new email exist and save in cache store', async () => {

        const input = {
            newEmail: "estevao@gmail.com"
        };

        const dataInToken = {
            userID: "123456789",
            email: "paulo@gmail.com"
        }

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123456789",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(false);

        vi.mocked(codeGeneratorServiceMock.generate).mockReturnValue("12345")


        await requestEmailUseCase.execute('abc-123-cde-456', input);

        expect(tokenServiceMock.verify).toHaveBeenCalledWith('abc-123-cde-456');
        expect(userRepositoryMock.existEmail).toHaveBeenCalledWith(input.newEmail);
        expect(codeGeneratorServiceMock.generate).toHaveBeenCalled();
        expect(mailChangeStoreMock.save).toHaveBeenCalledWith(dataInToken.userID, { newEmail: input.newEmail, code: "12345" }, 300);
        expect(mailServiceMock.send).toHaveBeenCalledWith(
            input.newEmail,
            "Alteração de email do usuário",
            `Seu Código de confirmação é ${"12345"}`
        )

    });


    it('Should throw error if token returns null.', async () => {

        const input = {
            newEmail: "estevao@gmail.com"
        };

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(requestEmailUseCase.execute('token-invalido', input)).rejects.toThrow('Token inválido ou expirado.');
        expect(userRepositoryMock.existEmail).not.toHaveBeenCalled();
        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailChangeStoreMock.save).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();
    });


    it('Should throw error if new email and actual email is equal.', async () => {

        const input = {
            newEmail: "paulo@gmail.com"
        };

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ email: 'paulo@gmail.com', userID: '12345' });

        await expect(requestEmailUseCase.execute('TOKEN-VALIDO', input)).rejects.toThrow("O novo email deve ser diferente do email atual.");

        expect(userRepositoryMock.existEmail).not.toHaveBeenCalled();
        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailChangeStoreMock.save).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();

    })

    it("Should throw error if new email exist in database.", async () => {

        const input = {
            newEmail: "estevao@gmail.com"
        };

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ email: 'paulo@gmail.com', userID: '12345' });

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(true);

        await expect(requestEmailUseCase.execute('TOKEN-VALIDO', input)).rejects.toThrow("Esse email já está em uso por outra conta.");

        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailChangeStoreMock.save).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();
    });

});
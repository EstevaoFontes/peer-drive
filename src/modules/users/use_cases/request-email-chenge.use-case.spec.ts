import { ITokenService } from "../../core/services/token-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { ICodeGeneratorService } from "../../core/services/generate-code-service.interface.js";
import { IMailChangeCacheService } from "../../core/services/mail-change-cache-service.interface.js";
import { IMailService } from "../../core/services/mail-service.interface.js";
import { RequestEmailChangeUseCase } from "./request-email-chenge.use-case.js";
import { describe, expect, it, beforeEach, vi, type Mocked } from "vitest";

describe('Test request mail change use case.', () => {

    type ITokenServiceMock = Mocked<ITokenService>;
    type IUserRepositoryMock = Mocked<IUserRepository>;
    type IMailChangeCacheServiceMock = Mocked<IMailChangeCacheService>;
    type ICodeGeneratorServiceMock = Mocked<ICodeGeneratorService>;
    type IMailServiceMock = Mocked<IMailService>;

    let tokenServiceMock: ITokenServiceMock;
    let userRepositoryMock: IUserRepositoryMock;
    let mailChangeCacheMock: IMailChangeCacheServiceMock;
    let codeGeneratorServiceMock: ICodeGeneratorServiceMock;
    let mailServiceMock: IMailServiceMock;
    let requestEmailUseCase: RequestEmailChangeUseCase;

    const input = {
        newEmail: "john@gmail.com"
    };

    beforeEach(() => {

        tokenServiceMock = {
            verify: vi.fn(),
            generate: vi.fn()
        }

        userRepositoryMock = {
            create: vi.fn(),
            existEmail: vi.fn(),
            findByEmail: vi.fn(),
            findById: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        }

        mailChangeCacheMock = {
            save: vi.fn(),
            consumeCode: vi.fn(),
        }

        codeGeneratorServiceMock = {
            generate: vi.fn(),
        }

        mailServiceMock = {
            send: vi.fn(),
        }

        requestEmailUseCase = new RequestEmailChangeUseCase(
            tokenServiceMock,
            userRepositoryMock,
            mailServiceMock,
            codeGeneratorServiceMock,
            mailChangeCacheMock
        );
    });


    it('Should save new email and verification code in chache and send email.', async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "123456789",
            email: "paulo@gmail.com"
        });

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(false);

        vi.mocked(codeGeneratorServiceMock.generate).mockReturnValue("12345")


        await requestEmailUseCase.execute('abc-123-cde-456', input);

        expect(tokenServiceMock.verify).toHaveBeenCalledWith('abc-123-cde-456');
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.existEmail).toHaveBeenCalledWith("john@gmail.com");
        expect(userRepositoryMock.existEmail).toHaveBeenCalledTimes(1);

        expect(codeGeneratorServiceMock.generate).toHaveBeenCalledTimes(1);

        expect(mailChangeCacheMock.save).toHaveBeenCalledWith("123456789", { newEmail: input.newEmail, code: "12345" }, 300);
        expect(mailChangeCacheMock.save).toHaveBeenCalledTimes(1);
        expect(mailChangeCacheMock.save).toHaveBeenCalledBefore(
            mailServiceMock.send
        );

        expect(mailServiceMock.send).toHaveBeenCalledTimes(1);
        expect(mailServiceMock.send).toHaveBeenCalledWith(
            input.newEmail,
            "Alteração de email do usuário",
            `Seu Código de confirmação é 12345`
        );

    });


    it('Should throw error if token returns null.', async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(requestEmailUseCase.execute('token-invalido', input)).rejects.toThrow('Token inválido ou expirado.');

        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);
        expect(tokenServiceMock.verify).toHaveBeenCalledWith('token-invalido');

        expect(userRepositoryMock.existEmail).not.toHaveBeenCalled();
        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailChangeCacheMock.save).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();
    });


    it('Should throw error if new email and actual email is equal.', async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ email: 'john@gmail.com', userID: '12345' });

        await expect(requestEmailUseCase.execute('TOKEN-VALIDO', input)).rejects.toThrow("O novo email deve ser diferente do email atual.");

        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.existEmail).not.toHaveBeenCalled();
        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailChangeCacheMock.save).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();

    })

    it("Should throw error if new email exist in database.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({ email: 'homer@gmail.com', userID: '12345' });

        vi.mocked(userRepositoryMock.existEmail).mockResolvedValue(true);

        await expect(requestEmailUseCase.execute('token-invalido', input)).rejects.toThrow("Esse email já está em uso por outra conta.");

        expect(tokenServiceMock.verify).toHaveBeenCalledWith('token-invalido');
        expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

        expect(userRepositoryMock.existEmail).toHaveBeenCalledWith('john@gmail.com');
        expect(userRepositoryMock.existEmail).toHaveBeenCalledTimes(1);

        expect(codeGeneratorServiceMock.generate).not.toHaveBeenCalled();
        expect(mailChangeCacheMock.save).not.toHaveBeenCalled();
        expect(mailServiceMock.send).not.toHaveBeenCalled();
    });

});
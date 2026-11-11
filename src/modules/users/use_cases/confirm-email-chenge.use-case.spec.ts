import { ITokenService } from "../../core/services/token-service.interface.js";
import { IUserRepository } from "../domain/repositories/user.repository.js";
import { IMailChangeCacheService } from "../../core/services/mail-change-cache-service.interface.js";
import { describe, expect, it, beforeEach, vi, type Mocked } from "vitest";
import { ConfirmEmailChengeUseCase } from "./confirm-email-chenge.use-case.js";
import { User } from "../domain/entities/user.entity.js";

describe('Confirm Email Change Use Case.', () => {

    type ITokenServiceMock = Mocked<ITokenService>;
    type IUserRepositoryMock = Mocked<IUserRepository>;
    type IMailChangeCacheServiceMock = Mocked<IMailChangeCacheService>;

    let tokenServiceMock: ITokenServiceMock;
    let userRepositoryMock: IUserRepositoryMock;
    let mailChangeCacheMock: IMailChangeCacheServiceMock;
    let confirmEmailChangeUseCase: ConfirmEmailChengeUseCase;
    let user: User

    const input = {
        code: "12345"
    };

    const recreateUser = () => User.restore(
        "abc-123-def",
        'teste@gmail.com',
        "Josh",
        "54587419516",
        "123-abc-456",
        new Date(),
        new Date()
    );

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
            delete: vi.fn()
        }

        mailChangeCacheMock = {
            save: vi.fn(),
            consumeCode: vi.fn(),
            remove: vi.fn()
        }

        user = recreateUser()

        confirmEmailChangeUseCase = new ConfirmEmailChengeUseCase(userRepositoryMock, mailChangeCacheMock, tokenServiceMock);
    });

    it("Should verify (token, code), search user in database and update new email.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "abc-123-def",
            email: "teste@gmail.com"
        });

        vi.mocked(mailChangeCacheMock.consumeCode).mockResolvedValue({ newEmail: "new_email@gmail.com"});

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user)

        await confirmEmailChangeUseCase.execute("abc-123", input);

        expect(userRepositoryMock.findById).toHaveBeenCalledWith("abc-123-def");
        expect(user.email.value).toBe("new_email@gmail.com")
        expect(userRepositoryMock.update).toHaveBeenCalledWith(user);
        expect(userRepositoryMock.update).toHaveBeenCalledTimes(1);
    });



    it('Test throw error in Token.', async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue(null);

        await expect(confirmEmailChangeUseCase.execute("abc-123", input)).rejects.toThrow("Token inválido ou expirado.")

        expect(mailChangeCacheMock.consumeCode).not.toHaveBeenCalled();
        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(user.email.value).toBe("teste@gmail.com")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    })


    it("Should throw error if cache is empty", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "abc-123-def",
            email: "teste@gmail.com"
        });

        vi.mocked(mailChangeCacheMock.consumeCode).mockResolvedValue(null);

        await expect(confirmEmailChangeUseCase.execute("abc-123", input)).rejects.toThrow(("Código inválido ou expirado."))

        expect(userRepositoryMock.findById).not.toHaveBeenCalled();
        expect(user.email.value).toBe("teste@gmail.com")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    }); 


    it("Should throw error if user is null", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "abc-123-def",
            email: "teste@gmail.com"
        });

        vi.mocked(mailChangeCacheMock.consumeCode).mockResolvedValue({ newEmail: "new_email@gmail.com"});

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(null);


        await expect(confirmEmailChangeUseCase.execute("abc-123", input)).rejects.toThrow(("Houve um erro, por favor tente novamente mais tarde."))

        expect(user.email.value).toBe("teste@gmail.com")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });


    it("Should throw error if id user in token is different id user in database.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "abc-123",
            email: "teste@gmail.com"
        });

        vi.mocked(mailChangeCacheMock.consumeCode).mockResolvedValue({ newEmail: "new_email@gmail.com"});

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await expect(confirmEmailChangeUseCase.execute("abc-123", input)).rejects.toThrow(("Houve erro, tente novamente mais tarde"))

        expect(user.email.value).toBe("teste@gmail.com")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if email is empty.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "abc-123-def",
            email: "teste@gmail.com"
        });

        vi.mocked(mailChangeCacheMock.consumeCode).mockResolvedValue({ newEmail: ""});

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await expect(confirmEmailChangeUseCase.execute("abc-123", input)).rejects.toThrow(('O email deve ser passado.'))

        expect(user.email.value).toBe("teste@gmail.com")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

    it("Should throw error if new email is equal than email in database.", async () => {

        vi.mocked(tokenServiceMock.verify).mockResolvedValue({
            userID: "abc-123-def",
            email: "teste@gmail.com"
        });

        vi.mocked(mailChangeCacheMock.consumeCode).mockResolvedValue({ newEmail: "teste@gmail.com"});

        vi.mocked(userRepositoryMock.findById).mockResolvedValue(user);

        await expect(confirmEmailChangeUseCase.execute("abc-123", input)).rejects.toThrow(( "O novo email deve ser diferente do atual."))

        expect(user.email.value).toBe("teste@gmail.com")
        expect(userRepositoryMock.update).not.toHaveBeenCalled();
    });

});
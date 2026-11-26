import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
// CONTROLLER
import { AuthController } from "./auth.controller.js";
// INTERFACE
import { ILoginUserUseCase } from "../../interfaces/login-user-use-case.interface.js";
import { IForgotPasswordUseCase } from "../../interfaces/request-forgot-password.interface.js";
import { IConfirmForgotPasswordUseCase } from "../../interfaces/confirm-forgot-password.interface.js";

describe("Test Controller Auth User.", () => {

    type LoginUserUseCaseMock = Mocked<ILoginUserUseCase>;
    type ForgotPasswordUseCase = Mocked<IForgotPasswordUseCase>;
    type ConfirmForgotPasswordUseCase = Mocked<IConfirmForgotPasswordUseCase>;

    let loginUserUseCaseMock: LoginUserUseCaseMock;
    let forgotPasswordUseCaseMock: ForgotPasswordUseCase;
    let confirmForgotPasswordUseCaseMock: ConfirmForgotPasswordUseCase;
    let controller: AuthController;

    const login = {
        email: "john@gmail.com",
        password: "123456"
    };

    const forgotPassword = {
        email: "john@gmail.com"
    };

    const confirmForgotPassword = {
        code: "123456",
        newPassword: "teste-123",
        confirmNewPassword: "teste-123"
    };

    beforeEach(() => {

        loginUserUseCaseMock = {
            execute: vi.fn()
        };

        forgotPasswordUseCaseMock = {
            execute: vi.fn()
        };

        confirmForgotPasswordUseCaseMock = {
            execute: vi.fn()
        };

        controller = new AuthController(loginUserUseCaseMock, forgotPasswordUseCaseMock, confirmForgotPasswordUseCaseMock);
    });

    describe("Test Login user.", () => {

        it("Should Login User successfully.", async () => {

            loginUserUseCaseMock.execute.mockResolvedValue({
                accessToken: "abs-asd-544"
            });


            const response = await controller.login(login);


            expect(loginUserUseCaseMock.execute).toHaveBeenCalledWith(login);

            expect(response).toEqual({
                accessToken: "abs-asd-544"
            });
        });

        it("Should reject an invalid Email.", async () => {

            const emailInvalid = {
                ...login,
                email: "johngmail.com"
            };

            await expect(controller.login(emailInvalid)).rejects.toThrow("Formato de Email inválido.");

            expect(loginUserUseCaseMock.execute).not.toHaveBeenCalled();
        });

        it("Should reject an empty password.", async () => {

            const passInvalid = {
                ...login,
                password: ""
            };

            await expect(controller.login(passInvalid)).rejects.toThrow("Informa a senha");

            expect(loginUserUseCaseMock.execute).not.toHaveBeenCalled();
        });
    });

    describe("Test Request Forgot Password.", () => {

        it("Should verify schema and execute use case.", async () => {

            const response = await controller.requestForgotPassword(forgotPassword);

            expect(forgotPasswordUseCaseMock.execute).toHaveBeenCalledWith(forgotPassword);

            expect(response).toEqual({
                message: "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
            });
        });

        it("Should reject an Email.", async () => {

            const wrongInput = {
                ...forgotPassword,
                email: "johgmail.com"
            };

            await expect(controller.requestForgotPassword(wrongInput)).rejects.toThrow("Formato de Email inválido.");

            expect(forgotPasswordUseCaseMock.execute).not.toHaveBeenCalled();

        });
    });


    describe("Test Confirm Forgot Password.", () => {

        it("Should verify schema and execute use case.", async () => {

            const response = await controller.confirmForgotPassword(confirmForgotPassword);

            expect(confirmForgotPasswordUseCaseMock.execute).toHaveBeenCalledWith(confirmForgotPassword);

            expect(response).toEqual({
                message: "Sua senha foi alterada com sucesso, você já pode fazer o login com a nova senha."
            });

        });

        it("Should Reject invalid Code.", async () => {

            const wrongInput = {
                ...confirmForgotPassword,
                code: "123"
            };

            await expect(controller.confirmForgotPassword(wrongInput)).rejects.toThrow("O código deve conter 6 dígitos.");

            expect(confirmForgotPasswordUseCaseMock.execute).not.toHaveBeenCalled();

        });

        it("Should reject a password if it is less than 6.", async () => {

            const wrongInput = {
                ...confirmForgotPassword,
                newPassword: "123"
            };

            await expect(controller.confirmForgotPassword(wrongInput)).rejects.toThrow("A senha deve ter no minimo 6 caracteres.");

            expect(confirmForgotPasswordUseCaseMock.execute).not.toHaveBeenCalled();

        });

        it("Should Reject if Password is not equal in schema.", async () => {

            const wrongInput = {
                ...confirmForgotPassword,
                newPassword: "1234567"
            };

            await expect(controller.confirmForgotPassword(wrongInput)).rejects.toThrow("As senhas devem ser iguais.");

            expect(confirmForgotPasswordUseCaseMock.execute).not.toHaveBeenCalled();

        });
    });
});

import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import type { Request } from "express";
// CONTROLLER
import { UserController } from "./user.controller.js";
// INTERFACE
import { ICreateUserUseCase } from "../../interfaces/create-user.interface.js";
import { IChangeNameUseCase } from "../../interfaces/change-name-use-case.interface.js";
import { IChangePhoneNumberUseCase } from "../../interfaces/change-phone-number.interface.js";
import { IChangePasswordUseCase } from "../../interfaces/change-password-use-case.interface.js";
import { IGetUserUseCase } from "../../interfaces/get-user-use-case.interface.js";
import { IDeleteUserUseCase } from "../../interfaces/delete-user-use-case.interface.js";
import { IRequestChangeEmailUseCase } from "../../interfaces/request-change-email.interface.js";
import { IConfirmEmailChangeUseCase } from "../../interfaces/confirm-email.interface.js";

import { UnauthorizedException } from "@nestjs/common";


describe("Test User Controller.", () => {

    type CreateUserUseCaseMock = Mocked<ICreateUserUseCase>;
    type ChangeNameUseCaseMock = Mocked<IChangeNameUseCase>;
    type ChangePhoneNumberUseCaseMock = Mocked<IChangePhoneNumberUseCase>;
    type ChangePasswordUseCaseMock = Mocked<IChangePasswordUseCase>;
    type GetUserUseCaseMock = Mocked<IGetUserUseCase>;
    type DeleteUserUseCaseMock = Mocked<IDeleteUserUseCase>;
    type RequestEmailUseCaseMock = Mocked<IRequestChangeEmailUseCase>;
    type ConfirmEmailUseCaseMock = Mocked<IConfirmEmailChangeUseCase>;

    let createUserUseCaseMock: CreateUserUseCaseMock;
    let changeNameUseCaseMock: ChangeNameUseCaseMock;
    let changePhoneNumberUseCaseMock: ChangePhoneNumberUseCaseMock;
    let changePasswordUseCaseMock: ChangePasswordUseCaseMock;
    let getUserUseCaseMock: GetUserUseCaseMock;
    let deleteUserUseCaseMock: DeleteUserUseCaseMock;
    let requestEmailUseCaseMock: RequestEmailUseCaseMock;
    let confirmEmailUseCaseMock: ConfirmEmailUseCaseMock;

    let controller: UserController;

    beforeEach(() => {
        createUserUseCaseMock = {
            execute: vi.fn()
        };

        changeNameUseCaseMock = {
            execute: vi.fn()
        };

        changePhoneNumberUseCaseMock = {
            execute: vi.fn()
        };

        changePasswordUseCaseMock = {
            execute: vi.fn()
        };

        getUserUseCaseMock = {
            execute: vi.fn()
        };

        deleteUserUseCaseMock = {
            execute: vi.fn()
        };

        requestEmailUseCaseMock = {
            execute: vi.fn()
        };

        confirmEmailUseCaseMock = {
            execute: vi.fn()
        };

        controller = new UserController(
            createUserUseCaseMock,
            changeNameUseCaseMock,
            changePhoneNumberUseCaseMock,
            changePasswordUseCaseMock,
            getUserUseCaseMock,
            deleteUserUseCaseMock,
            requestEmailUseCaseMock,
            confirmEmailUseCaseMock
        );


    });

    describe("Test Create User.", () => {

        const user = {
            name: "John Doe",
            email: "john@gmail.com",
            cpf: "54587419516",
            phoneNumber: "11987654321",
            isContractAccepted: true,
            password: "nova-senha",
            confirmPassword: "nova-senha",
        };


        it("Should create an user successfully.", async () => {

            const response = await controller.createUser(user);

            expect(createUserUseCaseMock.execute).toHaveBeenCalledWith(user);

            expect(response).toEqual({ message: "User created successfully" });
        });

        it.each([

            {
                testCase: "Should reject an invalid name.",
                name: "Jo",
                email: "john@gmail.com",
                cpf: "54587419516",
                phoneNumber: "11987654321",
                isContractAccepted: true,
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "O nome deve contar no mínimo 3 caracteres."
            },

            {
                testCase: "Should reject an invalid email.",
                name: "John Doe",
                email: "johngmail.com",
                cpf: "54587419516",
                phoneNumber: "11987654321",
                isContractAccepted: true,
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "Formato do E-mail não aceito."
            },

            {
                testCase: "Should reject if cpf has less than 11 characters.",
                name: "John Doe",
                email: "john@gmail.com",
                cpf: "545874195",
                phoneNumber: "11987654321",
                isContractAccepted: true,
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "O CPF deve ter exatamente 11 números."
            },

            {
                testCase: "Should reject if cpf has letters.",
                name: "John Doe",
                email: "john@gmail.com",
                cpf: "54A87419516",
                phoneNumber: "11987654321",
                isContractAccepted: true,
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "O CPF deve conter apenas números."
            },

            {
                testCase: "Should reject an invalid phone number.",
                name: "John Doe",
                email: "john@gmail.com",
                cpf: "54587419516",
                phoneNumber: "11987654321234",
                isContractAccepted: true,
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "Número de celular inválido."
            },

            {
                testCase: "Should reject if password has less than 6 characters.",
                name: "John Doe",
                email: "john@gmail.com",
                cpf: "54587419516",
                phoneNumber: "11987654321",
                isContractAccepted: true,
                password: "12345",
                confirmPassword: "nova-senha",
                expectedError: "A senha deve ter no minimo 6 caracteres."
            },

            {
                testCase: "Should reject if contract is not accepted.",
                name: "John Doe",
                email: "john@gmail.com",
                cpf: "54587419516",
                phoneNumber: "11987654321",
                isContractAccepted: false,
                password: "nova-senha",
                confirmPassword: "nova-senha",
                expectedError: "É necessário aceitar os termos de uso"
            },

            {
                testCase: "Should reject if passwords is not equal.",
                name: "John Doe",
                email: "john@gmail.com",
                cpf: "54587419516",
                phoneNumber: "11987654321",
                isContractAccepted: true,
                password: "nova-senhas",
                confirmPassword: "nova-senha",
                expectedError: "As senhas devem ser iguais."
            },
        ])("$testCase", async ({ name, email, cpf, phoneNumber, password, confirmPassword, isContractAccepted, expectedError }) => {

            const wrongInput = {
                name,
                email,
                cpf,
                phoneNumber,
                isContractAccepted,
                password,
                confirmPassword
            };


            await expect(controller.createUser(wrongInput)).rejects.toThrow(expectedError);

            expect(createUserUseCaseMock.execute).not.toHaveBeenCalled();

        });

    });


    describe("Test change user name.", () => {

        const changeName = {
            name: "Roger"
        };

        const token = "121asd1as3d21as2d31asd3";

        const request = {
            cookies: {
                access_token: token
            }
        } as unknown as Request;

        it("Should change an user name successfully.", async () => {

            const response = await controller.changeName(changeName, request);

            expect(changeNameUseCaseMock.execute).toHaveBeenCalledWith(token, changeName);

            expect(response).toEqual({ message: "Username successfully changed." });
        });

        it("Should reject an invalid user name.", async () => {

            const wrongInput = {
                ...changeName,
                name: "Ro"
            };

            await expect(controller.changeName(wrongInput, request)).rejects.toThrow("O nome deve ter pelo menos 3 caracteres.");

            expect(changeNameUseCaseMock.execute).not.toHaveBeenCalled();
        });

        it("Should reject an invalid token.", async () => {

            changeNameUseCaseMock.execute.mockRejectedValue(
                new UnauthorizedException("Invalid token.")
            );

            await expect(controller.changeName(changeName, request))
                .rejects.toThrow("Invalid token.");

            expect(changeNameUseCaseMock.execute).toHaveBeenCalledWith(token, changeName);
        });


        it("Should reject if access token is missing.", async () => {
            const requestWithoutToken = {
                cookies: {}
            } as unknown as Request;

            await expect(
                controller.changeName(changeName, requestWithoutToken)
            ).rejects.toThrow(UnauthorizedException);

            expect(changeNameUseCaseMock.execute).not.toHaveBeenCalled();
        });

    });


    describe("Test change phone number.", () => {

        const changePhoneNumber = {
            newPhoneNumber: "11987654321"
        };

        const token = "121asd1as3d21as2d31asd3";

        const request = {
            cookies: {
                access_token: token
            }
        } as unknown as Request;

        it("Should change an phone number successfully.", async () => {

            const response = await controller.changePhoneNumber(changePhoneNumber, request);

            expect(changePhoneNumberUseCaseMock.execute).toHaveBeenCalledWith(token, changePhoneNumber);

            expect(response).toEqual({ message: "Phone Number successfully changed." });
        });

        it("Should reject an invalid phone number.", async () => {

            const wrongInput = {
                ...changePhoneNumber,
                newPhoneNumber: "1198765432"
            };

            await expect(controller.changePhoneNumber(wrongInput, request)).rejects.toThrow("Número de celular inválido.");

            expect(changePhoneNumberUseCaseMock.execute).not.toHaveBeenCalled();
        });

        it("Should reject an invalid token.", async () => {

            changePhoneNumberUseCaseMock.execute.mockRejectedValue(
                new UnauthorizedException("Invalid token.")
            );

            await expect(controller.changePhoneNumber(changePhoneNumber, request))
                .rejects.toThrow("Invalid token.");

            expect(changePhoneNumberUseCaseMock.execute).toHaveBeenCalledWith(token, changePhoneNumber);
        });


        it("Should reject if access token is missing.", async () => {
            const requestWithoutToken = {
                cookies: {}
            } as unknown as Request;

            await expect(
                controller.changePhoneNumber(changePhoneNumber, requestWithoutToken)
            ).rejects.toThrow(UnauthorizedException);

            expect(changePhoneNumberUseCaseMock.execute).not.toHaveBeenCalled();
        });

    });



    describe("Test change password.", () => {

        const changePassword = {
            actualPassword: "teste-123",
            newPassword: "teste-123",
            confirmNewPassword: "teste-123"
        };

        const token = "121asd1as3d21as2d31asd3";

        const request = {
            cookies: {
                access_token: token
            }
        } as unknown as Request;

        it("Should change an password successfully.", async () => {

            const response = await controller.changePassword(changePassword, request);

            expect(changePasswordUseCaseMock.execute).toHaveBeenCalledWith(token, changePassword);

            expect(response).toEqual({ message: "Password successfully changed." });
        });

        it.each([
            {
                testCase: "Should reject an invalid password.",
                actualPassword: "",
                newPassword: "nova-senha",
                confirmNewPassword: "nova-senha",
                expectedError: "A senha atual não pode ser vazia."
            },

            {
                testCase: "Should reject if password has less than 6 characters.",
                actualPassword: "antiga-senha",
                newPassword: "nova",
                confirmNewPassword: "nova",
                expectedError: "A nova senha deve ter pelo menos 6 caracteres."
            },

            {
                testCase: "Should reject if passwords is not equal.",
                actualPassword: "antiga-senha",
                newPassword: "nova-senha",
                confirmNewPassword: "nova-sen",
                expectedError: "As senhas devem ser iguais."
            },

        ])("$testCase", async ({ actualPassword, newPassword, confirmNewPassword, expectedError }) => {

            const wrongInput = {
                actualPassword,
                newPassword,
                confirmNewPassword
            };


            await expect(controller.changePassword(wrongInput, request)).rejects.toThrow(expectedError);

            expect(changePasswordUseCaseMock.execute).not.toHaveBeenCalled();

        });


        it("Should reject an invalid token.", async () => {

            changePasswordUseCaseMock.execute.mockRejectedValue(
                new UnauthorizedException("Invalid token.")
            );

            await expect(controller.changePassword(changePassword, request))
                .rejects.toThrow("Invalid token.");

            expect(changePasswordUseCaseMock.execute).toHaveBeenCalledWith(token, changePassword);
        });


        it("Should reject if access token is missing.", async () => {
            const requestWithoutToken = {
                cookies: {}
            } as unknown as Request;

            await expect(
                controller.changePassword(changePassword, requestWithoutToken)
            ).rejects.toThrow(UnauthorizedException);

            expect(changePasswordUseCaseMock.execute).not.toHaveBeenCalled();
        });

    });


    describe("Should GET user information.", () => {

        const token = "121asd1as3d21as2d31asd3";

        const request = {
            cookies: {
                access_token: token
            }
        } as unknown as Request;

        const userData = {
            email: "john@gmail.com",
            name: "John",
            cpf: "54587419516",
            phoneNumber: "11987654321",
            createdAt: new Date("2026-11-27T10:00:00.000Z"),
            updatedAt: new Date("2026-11-27T10:00:00.000Z")
        };

        it("Should get user data successfully.", async () => {

            getUserUseCaseMock.execute.mockResolvedValue(userData);

            const response = await controller.getUser(request);

            expect(getUserUseCaseMock.execute).toHaveBeenCalledWith(token);

            expect(response).toEqual(userData);
        });


        it("Should reject an invalid token.", async () => {

            getUserUseCaseMock.execute.mockRejectedValue(
                new UnauthorizedException("Invalid token.")
            );

            await expect(controller.getUser(request))
                .rejects.toThrow("Invalid token.");

            expect(getUserUseCaseMock.execute).toHaveBeenCalledWith(token);
        });


        it("Should reject if access token is missing.", async () => {
            const requestWithoutToken = {
                cookies: {}
            } as unknown as Request;

            await expect(
                controller.getUser(requestWithoutToken)
            ).rejects.toThrow(UnauthorizedException);

            expect(getUserUseCaseMock.execute).not.toHaveBeenCalled();
        });

    });


    describe("Should DELETE user information.", () => {

        const token = "121asd1as3d21as2d31asd3";

        const request = {
            cookies: {
                access_token: token
            }
        } as unknown as Request;


        it("Should delete user data successfully.", async () => {

            const response = await controller.deleteUser(request);

            expect(deleteUserUseCaseMock.execute).toHaveBeenCalledWith(token);

            expect(response).toEqual({ message: "The user has been successfully deleted." });
        });


        it("Should reject an invalid token.", async () => {

            deleteUserUseCaseMock.execute.mockRejectedValue(
                new UnauthorizedException("Invalid token.")
            );

            await expect(controller.deleteUser(request))
                .rejects.toThrow("Invalid token.");

            expect(deleteUserUseCaseMock.execute).toHaveBeenCalledWith(token);
        });

        it("Should reject if access token is missing.", async () => {
            const requestWithoutToken = {
                cookies: {}
            } as unknown as Request;

            await expect(
                controller.deleteUser(requestWithoutToken)
            ).rejects.toThrow(UnauthorizedException);

            expect(deleteUserUseCaseMock.execute).not.toHaveBeenCalled();
        });

    });

    describe("Test Request change email.", () => {

        const input = {
            newEmail: "roger@gmail.com"
        };

        const wrongInput = {
            newEmail: "johgmail.com"
        };

        const token = "121asd1as3d21as2d31asd3";

        const request = {
            cookies: {
                access_token: token
            }
        } as unknown as Request;


        it("Should send code to new Email.", async () => {

            const response = await controller.requestEmail(input, request);

            expect(requestEmailUseCaseMock.execute).toHaveBeenCalledWith(token, input);

            expect(response).toEqual({
                message: "A confirmation code has been sent to the new email address."
            });
        });

        it("Should reject an Email.", async () => {

            await expect(controller.requestEmail(wrongInput, request)).rejects.toThrow("Formato de Email inválido.");

            expect(requestEmailUseCaseMock.execute).not.toHaveBeenCalled();
        });


        it("Should reject an invalid token.", async () => {

            requestEmailUseCaseMock.execute.mockRejectedValue(
                new UnauthorizedException("Invalid token.")
            );

            await expect(controller.requestEmail(input, request))
                .rejects.toThrow("Invalid token.");

            expect(requestEmailUseCaseMock.execute).toHaveBeenCalledWith(token, input);
        });


        it("Should reject if access token is missing.", async () => {
            const requestWithoutToken = {
                cookies: {}
            } as unknown as Request;

            await expect(
                controller.requestEmail(input, requestWithoutToken)
            ).rejects.toThrow(UnauthorizedException);

            expect(requestEmailUseCaseMock.execute).not.toHaveBeenCalled();
        });
    });



    describe("Test Confirm change email.", () => {

        const input = {
            code: "123456"
        };

        const wrongInput = {
            code: "12345"
        };

        const token = "121asd1as3d21as2d31asd3";

        const request = {
            cookies: {
                access_token: token
            }
        } as unknown as Request;


        it("Should update email.", async () => {

            const response = await controller.confirmEmail(input, request);

            expect(confirmEmailUseCaseMock.execute).toHaveBeenCalledWith(token, input);

            expect(response).toEqual({
                message: "The email has been updated successfully."
            });
        });

        it("Should reject code.", async () => {

            await expect(controller.confirmEmail(wrongInput, request)).rejects.toThrow("O código deve conter 6 dígitos.");

            expect(confirmEmailUseCaseMock.execute).not.toHaveBeenCalled();
        });


        it("Should reject an invalid token.", async () => {

            confirmEmailUseCaseMock.execute.mockRejectedValue(
                new UnauthorizedException("Invalid token.")
            );

            await expect(controller.confirmEmail(input, request))
                .rejects.toThrow("Invalid token.");

            expect(confirmEmailUseCaseMock.execute).toHaveBeenCalledWith(token, input);
        });

        
        it("Should reject if access token is missing.", async () => {
            const requestWithoutToken = {
                cookies: {}
            } as unknown as Request;

            await expect(
                controller.confirmEmail(input, requestWithoutToken)
            ).rejects.toThrow(UnauthorizedException);

            expect(confirmEmailUseCaseMock.execute).not.toHaveBeenCalled();
        });
    });




















































































});
import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import { AuthController } from "./auth.controller.js";
import { ILoginUserUseCase } from "../../interfaces/login-user-use-case.interface.js";
import { loginUserSchema } from "../../schemas/user/login-user.schemas.js";

describe("Test Controller Auth User.", () => {

    type LoginUserUseCaseMock = Mocked<ILoginUserUseCase>;

    let loginUserUseCaseMock: LoginUserUseCaseMock;
    let controller: AuthController;

    const login = {
        email: "john@gmail.com",
        password: "123456"
    };

    beforeEach(() => {

        loginUserUseCaseMock = {
            execute: vi.fn()
        };

        controller = new AuthController(loginUserUseCaseMock);
    });

    it("Should authorize user and return login.", async () => {

        loginUserUseCaseMock.execute.mockResolvedValue({
            accessToken: "abs-asd-544"
        });

        const result = loginUserSchema.safeParse(login);

        const response = await controller.authUser(login);

        expect(result.success).toBe(true);

        expect(loginUserUseCaseMock.execute).toHaveBeenCalledWith(login);

        expect(response).toEqual({
            accessToken: "abs-asd-544"
        });
    });

    it("Should reject email in schema.", async () => {
        const emailInvalid = {
            ...login,
            email: "johngmail.com"
        };

        await expect(controller.authUser(emailInvalid)).rejects.toThrow("Formato de Email inválido.");

        expect(loginUserUseCaseMock.execute).not.toHaveBeenCalled();
    });

    it("Should reject password in schema.", async () => {
        const passInvalid = {
            ...login,
            password: ""
        };

        await expect(controller.authUser(passInvalid)).rejects.toThrow("Informa a senha");

        expect(loginUserUseCaseMock.execute).not.toHaveBeenCalled();
    });
});

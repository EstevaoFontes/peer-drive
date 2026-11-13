import * as z from "zod";
import { confirmationCodeSchema } from "./confirmation-code.schema.js";

export const confirmForgotPasswordSchema = z.object({
    code: confirmationCodeSchema,
    email: z.email("Formato do E-mail não aceito."),
    newPassword: z.string().min(6, "A senha deve ter no minimo 6 caracteres."),
    confirmNewPassword: z.string(),
}).refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
        message: "As senhas devem ser iguais.",
        path: ["confirmNewPassword"]
    }
);
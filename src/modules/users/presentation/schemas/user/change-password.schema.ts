import * as z from "zod";

export const changePasswordSchema = z.object({
    actualPassword: z.string(),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    confirmNewPassword: z.string(),
}).refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
        message: "As senhas devem ser iguais.",
        path: ["confirmNewPassword"]
    });
    
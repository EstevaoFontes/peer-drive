import * as z from "zod";

export const requestForgotPasswordSchema = z.object({
    email: z.email("Formato de Email inválido."),
});
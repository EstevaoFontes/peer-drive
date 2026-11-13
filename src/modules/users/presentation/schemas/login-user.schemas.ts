import * as z from "zod";

export const loginUserSchema = z.object({
    email: z.email("Formato de Email inválido."),
    password: z.string().min(1, "Informe a sua senha.")
});
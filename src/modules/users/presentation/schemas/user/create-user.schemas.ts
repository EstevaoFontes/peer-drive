import * as z from "zod";
import { phoneNumberSchema } from "./phoneNumber.schema.js";

export const createUserSchema = z.object({
    name: z.string().trim().min(3, "O nome deve contar no mínimo 3 caracteres."),
    email: z.email("Formato do E-mail não aceito."),
    cpf: z.string()
        .length(11, "O CPF deve ter exatamente 11 números.")
        .regex(/^\d+$/, "O CPF deve conter apenas números."),
    password: z.string().min(6, "A senha deve ter no minimo 6 caracteres."),
    confirmPassword: z.string({
        error: "A confirmação de senha não pode ser vazia."
    }),
    isContractAccepted: z.literal(true, { error: "É necessário aceitar os termos de uso" }),
    phoneNumber: phoneNumberSchema
}).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "As senhas devem ser iguais.",
        path: ["confirmPassword"]
    }
);  
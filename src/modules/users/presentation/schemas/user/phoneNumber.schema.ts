import * as z from "zod";

export const phoneNumberSchema = z
    .string()
    .transform((phone) => phone.replace(/\D/g, ""))
    .refine(
        (phone) => /^[1-9]{2}9\d{8}$/.test(phone),
        "Número de celular inválido."
    );
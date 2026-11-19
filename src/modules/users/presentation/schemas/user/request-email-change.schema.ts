import * as z from "zod";

export const requestEmailChangeSchema = z.object({
    newEmail: z.email("Formato de Email inválido."),
});
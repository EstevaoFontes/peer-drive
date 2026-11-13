import * as z from "zod";

export const changeNameSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "O nome deve ter pelo menos 3 caracteres.")
});
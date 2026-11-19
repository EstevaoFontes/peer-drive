import * as z from "zod";

export const renewDriverLicenseSchema = z.object({
    expirationDate: z.coerce.date({
        error: "A data de validade da CNH é inválida"
    })
});  
import * as z from "zod";
import { DriveLicenseCategory } from "../../../domain/enums/driver-license-category.enum.js";

export const createDriverLicenseSchema = z.object({
    registration: z.string({
        error: "Registro da habilitação invalido."
    }).length(11, {
        error: "O registro da habilitação deve conter exatamente 11 caracteres."
    }),
    category: z.enum(DriveLicenseCategory, {
        error: "A catégoria é invalida."
    }),
    firstLicenseDate: z.coerce.date({
        error: "A data da primeira habilitação CNH é invalida."
    }),
    expirationDate: z.coerce.date({
        error: "A data de expiração da habilitação é invalida."
    })
});  
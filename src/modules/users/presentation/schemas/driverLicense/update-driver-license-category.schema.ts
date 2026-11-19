import * as z from "zod";
import { DriveLicenseCategory } from "../../../domain/enums/driver-license-category.enum.js";

export const updateDriverLicenseCategorySchema = z.object({
    category:  z.enum(DriveLicenseCategory, {
        error: "A categoria é inválida"
    }),
});  
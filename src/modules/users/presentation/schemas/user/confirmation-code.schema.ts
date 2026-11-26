import * as z from "zod";

export const confirmationCodeSchema = z
.string()
.regex(/^\d{6}$/, "O código deve conter 6 dígitos.");
import * as z from "zod";
import { phoneNumberSchema } from "./phoneNumber.schema.js";

export const changePhoneNumberSchema = z.object({
    newPhoneNumber: phoneNumberSchema
});
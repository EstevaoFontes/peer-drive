import * as z from "zod";
import { confirmationCodeSchema } from "./confirmation-code.schema.js";

export const confirmEmailChangeSchema = z.object({
    code: confirmationCodeSchema
});
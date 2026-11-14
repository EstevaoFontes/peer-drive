import { Injectable } from "@nestjs/common";
import { type ICodeGeneratorService } from "../../services/generate-code-service.interface.js";
import { randomInt } from "node:crypto";


@Injectable()
export class CodeGeneratorService implements ICodeGeneratorService {

    generate(): string {
        
        const code = randomInt(0, 1_000_000);

        return code.toString().padStart(6, "0");

    }
}
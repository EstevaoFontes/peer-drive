import { Injectable } from "@nestjs/common";
import { IHashService } from "../../services/password-hash-service.interface.js";
import * as bcrypt from "bcrypt";


@Injectable()
export class BcryptHashService implements IHashService {

    async hash(password: string): Promise<string> {

        const hash = await bcrypt.hash(password, 10);

        return hash;
    }


    async compare(password: string, hashed: string): Promise<boolean> {

        return await bcrypt.compare(password, hashed);
    }

}
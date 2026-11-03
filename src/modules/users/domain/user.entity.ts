import { Cpf } from "./value-objects/cpf-validate.value-objects.js";
import { Email } from "./value-objects/email-validate.value-objects.js";
import { UserId } from "./value-objects/id-create.value-objects.js";

export class User {
    constructor(
        public readonly id: UserId,
        public readonly email: Email,
        public name: string,
        public readonly cpf: Cpf,
        private password: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    get passwordValue(): string {
        return this.password;
    }


    static create(id: string, email: string, name: string, cpf: string, password: string): User {

        if (!name || name.trim().length < 3) {
            throw new Error('O nome não pode ter menos de 3 caracteres.');
        }

        if (password.length < 6) {
            throw new Error('A senha n pode ser menor que 6 caracteres.');
        }

        const userId = new UserId(id);
        const newEmail = new Email(email);
        const newCpf = new Cpf(cpf);
        const dateNow = new Date();

        const newUser = new User(
            userId,
            newEmail,
            name,
            newCpf,
            password,
            dateNow,
            dateNow
        );

        return newUser;
    }
}
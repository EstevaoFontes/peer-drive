import { Cpf } from "../value-objects/cpf-validate.value-objects.js";
import { Email } from "../value-objects/email-validate.value-objects.js";
import { UserId } from "../value-objects/id-create.value-objects.js";

export class User {
    constructor(
        public readonly id: UserId,
        public email: Email,
        public name: string,
        public readonly cpf: Cpf,
        private password: string,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { };

    get passwordValue(): string {
        return this.password;
    };

    public changeEmail(newEmail: string): void {

        if (!newEmail) {
            throw new Error("O email deve ser passado.");
        };

        if (newEmail === this.email.value) {
            throw new Error("O novo email deve ser diferente do atual.");
        };

        this.email = new Email(newEmail);
        this.updatedAt = new Date();

    };

    public changePassword(newPasswordHash: string): void {

        if (!newPasswordHash?.trim()) {
            throw new Error("O hash da senha não pode ser vazio.");
        };


        this.password = newPasswordHash;
        this.updatedAt = new Date();
    }

    public changeName(newName: string): void {

        if (!newName || newName.trim().length < 3) {
            throw new Error("O nome não pode ter menos de 3 caracteres.");
        }

        if (newName.trim() === this.name) {
            throw new Error("Os nomes não podem ser iguais.");
        }

        this.name = newName.trim();
    }


    static create(email: string, name: string, cpf: string, password: string): User {

        if (!name || name.trim().length < 3) {
            throw new Error("O nome não pode ter menos de 3 caracteres.");
        }

         if (!password.trim()) {
            throw new Error("A senha está mal formatada.");
        };

        const newEmail = new Email(email);
        const newCpf = new Cpf(cpf);
        const dateNow = new Date();

        const newUser = new User(
            new UserId(),
            newEmail,
            name,
            newCpf,
            password,
            dateNow,
            dateNow
        );

        return newUser;
    };

    static restore(
        id: string,
        email: string,
        name: string,
        cpf: string,
        password: string,
        createdAt: Date,
        updatedAt: Date
    ): User {

        return new User(
            new UserId(id),
            new Email(email),
            name,
            new Cpf(cpf),
            password,
            createdAt,
            updatedAt
        );
    };
};
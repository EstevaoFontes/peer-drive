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
            throw new Error('O email deve ser passado.')
        };

        if (newEmail === this.email.value) {
            throw new Error('O novo email deve ser diferente do atual.')
        };

        this.email = new Email(newEmail);
        this.updatedAt = new Date();

    };

    public changePassword(newPassword: string): void {

        if (!newPassword) {
            throw new Error('A senha deve ser passada.')
        };

        if (newPassword === this.passwordValue) {
            throw new Error('A nova senha não atende aos requisitos de segurança.')
        };

        if (newPassword.length < 6) {
            throw new Error('A senha não pode ser menor que 6 caracteres.')
        };

        this.password = newPassword
        this.updatedAt = new Date();
    }


    static create(email: string, name: string, cpf: string, password: string): User {

        if (!name || name.trim().length < 3) {
            throw new Error('O nome não pode ter menos de 3 caracteres.');
        }

        if (password.length < 6) {
            throw new Error('A senha não pode ser menor que 6 caracteres.');
        }

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
        )
    };
};
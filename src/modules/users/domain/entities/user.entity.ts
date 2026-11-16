import { Cpf } from "../value-objects/cpf-validate.value-objects.js";
import { Email } from "../value-objects/email-validate.value-objects.js";
import { UserId } from "../value-objects/id-create.value-objects.js";
import { DriverLicense } from "../value-objects/drive-license.value-objects.js";
import { DriveLicenseCategory } from "../enums/driver-license-category.enum.js";

interface ICreateUser {
    email: string;
    name: string;
    cpf: string;
    phoneNumber: string;
    password: string;
    isContractAccepted: boolean;
}

export interface IRestoreUser {
    id: string;
    email: string;
    name: string;
    cpf: string;
    phoneNumber: string;
    password: string;
    isContractAccepted: boolean;
    createdAt: Date;
    updatedAt: Date;
    driverLicense: DriverLicense | null | undefined
}

interface IAddDriverLicense {
    registration: string
    category: DriveLicenseCategory
    firstLicenseDate: Date,
    expirationDate: Date
}

export class User {
    constructor(
        public readonly id: UserId,
        public email: Email,
        public name: string,
        public readonly cpf: Cpf,
        public phoneNumber: string,
        private password: string,
        private isContractAccepted: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date,
        private driveLicense: DriverLicense | null | undefined
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


    static create(input: ICreateUser): User {

        if (!input.name || input.name.trim().length < 3) {
            throw new Error("O nome não pode ter menos de 3 caracteres.");
        }

        if (!input.password.trim()) {
            throw new Error("A senha está mal formatada.");
        };

        if (!input.isContractAccepted) {
            throw new Error("O contrato deve ser aceito");
        };

        if (!input.phoneNumber) {
            throw new Error("O número de telefone não pode ser vazio.");
        };

        const newEmail = new Email(input.email);
        const newCpf = new Cpf(input.cpf);
        const dateNow = new Date();

        const newUser = new User(
            new UserId(),
            newEmail,
            input.name,
            newCpf,
            input.phoneNumber,
            input.password,
            true,
            dateNow,
            dateNow,
            null
        );

        return newUser;
    };

    static restore(input: IRestoreUser): User {

        return new User(
            new UserId(input.id),
            new Email(input.email),
            input.name,
            new Cpf(input.cpf),
            input.phoneNumber,
            input.password,
            true,
            input.createdAt,
            input.updatedAt,
            input.driverLicense
        );
    };

    public addDriverLicense(input: IAddDriverLicense): void {

        if (this.driveLicense === undefined) {
            throw new Error("A CNH precisa ser carregada para realizar esta operação.");
        }

        if (this.driveLicense !== null) {
            throw new Error("Carteira de motorista já cadastrada.");
        }

        this.driveLicense = DriverLicense.create({
            ...input,
            userId: this.id
        });

        this.updatedAt = new Date();
    }
};
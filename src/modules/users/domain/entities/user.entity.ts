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


interface GetDriverLicenseDTO {
    readonly registration: string
    readonly category: DriveLicenseCategory
    readonly firstLicenseDate: Date,
    readonly expirationDate: Date
}

export class User {
    constructor(
        private readonly _id: UserId,
        private _email: Email,
        private _name: string,
        private readonly _cpf: Cpf,
        private _phoneNumber: string,
        private _password: string,
        private readonly isContractAccepted: boolean,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
        private _driverLicense: DriverLicense | null | undefined
    ) { };

    get id(): UserId {
        return this._id;
    }

    get password(): string {
        return this._password;
    };

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    get name(): string {
        return this._name;
    }

    get email(): Email {
        return this._email;
    }

    get cpf(): Cpf {
        return this._cpf;
    }

    get createdAt(): Date {
        return new Date(this._createdAt);
    }

    get updatedAt(): Date {
        return new Date(this._updatedAt);
    }

    public changePhoneNumber(newPhoneNumber: string): void {

        if (!newPhoneNumber.trim()) {
            throw new Error("O número de telefone não pode ser vazio.");
        }

        if (newPhoneNumber === this._phoneNumber) {
            throw new Error("O número novo deve ser diferente do atual.");
        }

        this._phoneNumber = newPhoneNumber;

        this._updatedAt = new Date();
    }

    public changeEmail(newEmail: string): void {

        if (!newEmail) {
            throw new Error("O email deve ser passado.");
        };

        if (newEmail === this._email.value) {
            throw new Error("O novo email deve ser diferente do atual.");
        };

        this._email = new Email(newEmail);
        this._updatedAt = new Date();

    };

    public changePassword(newPasswordHash: string): void {

        if (!newPasswordHash?.trim()) {
            throw new Error("O hash da senha não pode ser vazio.");
        };


        this._password = newPasswordHash;
        this._updatedAt = new Date();
    }

    public changeName(newName: string): void {

        if (!newName || newName.trim().length < 3) {
            throw new Error("O nome não pode ter menos de 3 caracteres.");
        }

        if (newName.trim() === this.name) {
            throw new Error("Os nomes não podem ser iguais.");
        }

        this._name = newName.trim();
        this._updatedAt = new Date();
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

        if (!input.phoneNumber.trim()) {
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
            input.isContractAccepted,
            input.createdAt,
            input.updatedAt,
            input.driverLicense
        );
    };

    public addDriverLicense(input: IAddDriverLicense): void {

        if (this._driverLicense === undefined) {
            throw new Error("A CNH precisa ser carregada para realizar esta operação.");
        }

        if (this._driverLicense !== null) {
            throw new Error("Carteira de motorista já cadastrada.");
        }

        this._driverLicense = DriverLicense.create({
            ...input,
            userId: this.id
        });

        this._updatedAt = new Date();
    }

    public get driverLicense(): GetDriverLicenseDTO | null | undefined {
        if (this._driverLicense === null) {
            return null;
        }

        if (this._driverLicense === undefined) {
            return undefined;
        }
        

        return {
            registration: this._driverLicense.registration,
            category: this._driverLicense.category,
            firstLicenseDate: new Date(this._driverLicense.firstLicenseDate),
            expirationDate: new Date(this._driverLicense.expirationDate)
        };
    }
};
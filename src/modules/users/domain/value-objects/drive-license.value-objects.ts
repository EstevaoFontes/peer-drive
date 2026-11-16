import { UserId } from "./id-create.value-objects.js";
import { DriveLicenseCategory } from "../enums/driver-license-category.enum.js";

export interface ICreateDriverLicense {
    userId: UserId
    registration: string
    category: DriveLicenseCategory
    firstLicenseDate: Date,
    expirationDate: Date
}

interface IRestoreDriverLicense {
    userId: UserId
    registration: string
    category: DriveLicenseCategory
    firstLicenseDate: Date,
    expirationDate: Date
}

export class DriverLicense {
    private constructor(
        private readonly _userId: UserId,
        private readonly _registration: string,
        private _category: DriveLicenseCategory,
        private readonly _firstLicenseDate: Date,
        private _expirationDate: Date,

    ) { }

    get userId(): UserId{
        return this._userId;
    }

    get registration(): string{
        return this._registration;
    }

    get category(): DriveLicenseCategory{
        return this._category;
    }

    get firstLicenseDate(): Date{
        return new Date(this._firstLicenseDate);
    }

    get expirationDate(): Date{
        return new Date(this._expirationDate);
    }

    static create(input: ICreateDriverLicense): DriverLicense {

        if (!input.userId) {
            throw new Error("Erro ao criar a Carteira de Habilitação.");
        }

        if (!input.registration?.trim()) {
            throw new Error("O número de registro não pode ser vazio.");
        }

        if (!input.category) {
            throw new Error("Uma categoria deve ser selecionada.");
        }

        if (!Object.values(DriveLicenseCategory).includes(input.category)) {
            throw new Error("A categoria informada é inválida.");
        }

        if (!input.firstLicenseDate) {
            throw new Error("A data da primeira habilitação deve ser passada.");
        }

        if (!input.expirationDate) {
            throw new Error("A data de expiração deve ser passada.");
        }

        if (
            !(input.expirationDate instanceof Date) ||
            !(input.firstLicenseDate instanceof Date) ||
            Number.isNaN(input.expirationDate.getTime()) ||
            Number.isNaN(input.firstLicenseDate.getTime())
        ) {
            throw new Error("Datas mal formatadas.");
        }

        if (input.expirationDate.getTime() <= input.firstLicenseDate.getTime()) {
            throw new Error("A data de expiração não pode ser menor que a data da primeira habilitação.");
        }

        return new DriverLicense(
            input.userId,
            input.registration,
            input.category,
            input.firstLicenseDate,
            input.expirationDate
        );
    }


    static restore(dataBaseInput: IRestoreDriverLicense): DriverLicense {
        return new DriverLicense(
            dataBaseInput.userId,
            dataBaseInput.registration,
            dataBaseInput.category,
            dataBaseInput.firstLicenseDate,
            dataBaseInput.expirationDate
        );
    }


    public renewal(newexpirationDate: Date): void {

        if (!(newexpirationDate instanceof Date) || Number.isNaN(newexpirationDate.getTime())) {
            throw new Error("Datas mal formatadas.");
        }

        if (newexpirationDate.getTime() <= this._expirationDate.getTime()) {
            throw new Error("A nova data de expiração deve ser posterior à data atual.");
        }

        const oneDayInMs = 1000 * 60 * 60 * 24;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const actualExpiredDate = new Date(this._expirationDate);
        actualExpiredDate.setHours(0, 0, 0, 0);

        const differenceInMs = Math.abs(actualExpiredDate.getTime() - today.getTime());
        const differenceInDays = Math.ceil(differenceInMs / oneDayInMs);

        if (differenceInDays > 3) {
            throw new Error(
                "A renovação só pode ser realizada quando faltarem 3 dias ou menos para o vencimento."
            );
        }

        this._expirationDate = newexpirationDate;
    }


    public addNewCategory(newCategory: DriveLicenseCategory): void {

        if (!Object.values(DriveLicenseCategory).includes(newCategory)) {
            throw new Error("A categoria informada é inválida.");
        }

        if(newCategory == this._category){
            throw new Error("A nova categoria não pode ser o mesmo da anterior.");
        }

        this._category = newCategory;
    }
}
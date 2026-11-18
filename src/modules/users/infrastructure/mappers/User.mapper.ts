import type { UserModel } from "../model/User.model.js";
import { User } from "../../domain/entities/user.entity.js";
import { DriverLicense } from "../../domain/value-objects/drive-license.value-objects.js";
import { UserId } from "../../domain/value-objects/id-create.value-objects.js";
import { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";


function toDriveLicenseCategory(category: string): DriveLicenseCategory {
    if (!Object.values(DriveLicenseCategory).includes(category as DriveLicenseCategory)) {
        throw new Error("Categoria de CNH inválida no banco de dados.");
    }

    return category as DriveLicenseCategory;
}


export class UserMapper {

    static toDomain(model: UserModel): User {

        let driverLicense: DriverLicense | null | undefined;

        if (model.driverLicense === undefined) {
            driverLicense = undefined;
        } else if (model.driverLicense === null) {
            driverLicense = null;
        } else {
            driverLicense = DriverLicense.restore({
                userId: new UserId(model.driverLicense.userId),
                registration: model.driverLicense.registration,
                category: toDriveLicenseCategory(model.driverLicense.category),
                firstLicenseDate: model.driverLicense.firstLicenseDate,
                expirationDate: model.driverLicense.expirationDate
            });
        }

        return User.restore({
            id: model.id,
            email: model.email,
            cpf: model.cpf,
            name: model.name,
            phoneNumber: model.phoneNumber,
            password: model.password,
            isContractAccepted: model.isContractAccepted,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            driverLicense: driverLicense ?? null
        });
    }
}
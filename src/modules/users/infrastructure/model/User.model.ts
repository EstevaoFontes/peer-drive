import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import { sequelize } from "../../../core/infrastructure/database/sequelize.js";
import type { DriverLicenseModel } from "./DriverLicense.model.js";

export class UserModel extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
> {
    declare id: string;
    declare email: string;
    declare name: string;
    declare cpf: string;
    declare phoneNumber: string;
    declare password: string;
    declare isContractAccepted: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare driverLicense?: NonAttribute<DriverLicenseModel | null>;
}

UserModel.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    isContractAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "users",
    timestamps: false
});
























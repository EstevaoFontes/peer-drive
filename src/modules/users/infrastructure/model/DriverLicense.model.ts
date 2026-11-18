import { sequelize } from "../../../core/infrastructure/database/sequelize.js";
import { DataTypes, Model, InferCreationAttributes, InferAttributes } from "sequelize";
import { UserModel } from "./User.model.js";

export class DriverLicenseModel extends Model<
    InferAttributes<DriverLicenseModel>,
    InferCreationAttributes<DriverLicenseModel>
> {
    declare userId: string;
    declare registration: string;
    declare category: string;
    declare firstLicenseDate: Date;
    declare expirationDate: Date;

}


DriverLicenseModel.init({
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
            model: UserModel,
            key: "id"
        }
    },
    registration: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    firstLicenseDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expirationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "driverLicense",
    timestamps: false
});

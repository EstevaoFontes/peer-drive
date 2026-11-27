
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    Unique,
    HasOne
} from "sequelize-typescript";

import type {
    InferAttributes,
    InferCreationAttributes
} from "sequelize";

import { DriverLicenseModel } from "./DriverLicense.model.js";

@Table({
    tableName: "users",
    timestamps: false
})
export class UserModel extends Model<
    InferAttributes<UserModel>,
    InferCreationAttributes<UserModel>
> {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare id: string;

    @Unique
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    declare name: string;

    @Unique
    @Column({
        type: DataType.STRING(11),
        allowNull: false
    })
    declare cpf: string;

    @Column({
        type: DataType.STRING(15),
        allowNull: false
    })
    declare phoneNumber: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare isContractAccepted: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare updatedAt: Date;

    @HasOne(() => DriverLicenseModel, {
        foreignKey: "userId",
        as: "driverLicense",
        onDelete: "CASCADE"
    })
    declare driverLicense?: DriverLicenseModel | null;
}


import { Table, Column, Model, DataType, PrimaryKey, BelongsTo } from "sequelize-typescript";

import type { InferAttributes, InferCreationAttributes } from "sequelize";

import { UserModel } from "./User.model.js";

import type { DriveLicenseCategory } from "../../domain/enums/driver-license-category.enum.js";

@Table({
    tableName: "driverLicense",
    timestamps: false
})
export class DriverLicenseModel extends Model<
    InferAttributes<DriverLicenseModel>,
    InferCreationAttributes<DriverLicenseModel>
> {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE"
    })
    declare userId: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    declare registration: string;

    @Column({
        type: DataType.STRING(2),
        allowNull: false
    })
    declare category: DriveLicenseCategory;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare firstLicenseDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare expirationDate: Date;

    @BelongsTo(() => UserModel, {
        foreignKey: "userId",
        as: "user"
    })
    declare user?: UserModel;
}

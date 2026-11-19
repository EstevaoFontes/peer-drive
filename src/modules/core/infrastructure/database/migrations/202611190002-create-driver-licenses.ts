
import { DataTypes } from "sequelize";
import type { MigrationParams } from "umzug";
import type { Sequelize } from "sequelize";

export async function up({ context }: MigrationParams<Sequelize>) {
    const queryInterface = context.getQueryInterface();

    await queryInterface.createTable("driverLicense", {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "users",
                key: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
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
    });
}

export async function down({ context }: MigrationParams<Sequelize>) {
    const queryInterface = context.getQueryInterface();

    await queryInterface.dropTable("driverLicense");
}

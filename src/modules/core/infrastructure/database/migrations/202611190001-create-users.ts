
import { DataTypes } from "sequelize";
import type { MigrationParams } from "umzug";
import type { Sequelize } from "sequelize";

export async function up({ context }: MigrationParams<Sequelize>) {
    const queryInterface = context.getQueryInterface();

    await queryInterface.createTable("users", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
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
            type: DataTypes.STRING(11),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
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
    });
}

export async function down({ context }: MigrationParams<Sequelize>) {
    const queryInterface = context.getQueryInterface();

    await queryInterface.dropTable("users");
}

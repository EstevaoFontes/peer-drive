import { Sequelize } from "sequelize-typescript";

import { UserModel } from "../../../users/infrastructure/model/User.model.js";
import { DriverLicenseModel } from "../../../users/infrastructure/model/DriverLicense.model.js";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    models:[
        UserModel,
        DriverLicenseModel
    ],
    logging: false
});
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { UserModel } from "./model/User.model.js";
import { DriverLicenseModel } from "./model/DriverLicense.model.js";

@Module({
    imports: [
        SequelizeModule.forFeature([
            UserModel,
            DriverLicenseModel
        ])
    ],
    exports: [
        SequelizeModule
    ]
})
export class UserPersistenceModule {}
import { DriverLicenseModel } from "./DriverLicense.model.js";
import { UserModel } from "./User.model.js";

DriverLicenseModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "user"
});

UserModel.hasOne(DriverLicenseModel, {
    foreignKey: "userId",
    as: "driverLicense",
    onDelete: "CASCADE"
});
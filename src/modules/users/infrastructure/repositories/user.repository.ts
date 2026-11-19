import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { UserMapper } from "../mappers/User.mapper.js";
import { UserModel } from "../model/User.model.js";
import { DriverLicenseModel } from "../model/DriverLicense.model.js";
import "../model/assossiations.js";
import { User } from "../../domain/entities/user.entity.js";
import { sequelize } from "../../../core/infrastructure/database/sequelize.js";


export class UserRepository implements IUserRepository {

    async create(user: User): Promise<void> {

        await UserModel.create({
            id: user.id.value,
            email: user.email.value,
            cpf: user.cpf.value,
            name: user.name,
            password: user.password,
            phoneNumber: user.phoneNumber,
            isContractAccepted: user.isContractAccepted,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });

    }

    async existEmail(email: string): Promise<boolean> {

        const user = await UserModel.findOne({
            where: { email }
        });

        return user !== null;

    }

    async findByEmail(email: string): Promise<User | null> {

        const user = await UserModel.findOne({
            where: { email }
        });

        if (!user) {
            return null;
        }

        return UserMapper.toDomain(user);

    }

    async findById(id: string): Promise<User | null> {

        const user = await UserModel.findByPk(id);

        if (!user) {
            return null;
        }

        return UserMapper.toDomain(user);
    }

    async findByIdWithDriverLicense(id: string): Promise<User | null> {

        const user = await UserModel.findByPk(id, {
            include: {
                model: DriverLicenseModel,
                as: "driverLicense"
            }
        });

        if (!user) {
            return null;
        }

        return UserMapper.toDomain(user);
    }

    async update(user: User): Promise<void> {
        
        await sequelize.transaction(async (transaction) => {
            await UserModel.update({
                email: user.email.value,
                cpf: user.cpf.value,
                name: user.name,
                password: user.password,
                phoneNumber: user.phoneNumber,
                isContractAccepted: user.isContractAccepted,
                updatedAt: user.updatedAt
            }, {
                where: {
                    id: user.id.value
                },
                transaction
            });

            if (user.driverLicense === undefined || user.driverLicense === null) {
                return;
            }

            await DriverLicenseModel.findOrCreate({
                where: {
                    userId: user.id.value
                },
                defaults: {
                    userId: user.id.value,
                    registration: user.driverLicense.registration,
                    category: user.driverLicense.category,
                    firstLicenseDate: user.driverLicense.firstLicenseDate,
                    expirationDate: user.driverLicense.expirationDate
                },
                transaction
            }).then(async ([driverLicense, created]) => {
                if (!created) {
                    await driverLicense.update({
                        registration: user.driverLicense!.registration,
                        category: user.driverLicense!.category,
                        firstLicenseDate: user.driverLicense!.firstLicenseDate,
                        expirationDate: user.driverLicense!.expirationDate
                    }, { transaction });
                }
            });
        });
    }

    async delete(id: string): Promise<boolean> {

        const user = await UserModel.findByPk(id);

        if (!user) {
            return false;
        }

        await user.destroy();

        return true;
    }
}
import { User } from "../entities/user.entity.js";

export const USER_REPOSITORY_TOKEN = "IUserRepository"

export interface IUserRepository {
    create(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    existEmail(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}
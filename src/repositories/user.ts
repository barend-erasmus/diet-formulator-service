import { User } from "../entities/user";

export interface IUserRepository {
    create(user: User, token: string): Promise<User>;
    find(token: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    update(user: User, token: string): Promise<User>;
}

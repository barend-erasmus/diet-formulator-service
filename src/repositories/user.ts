import { User } from '../entities/user';
import { IBaseRepository } from './base';

export interface IUserRepository extends IBaseRepository {
    create(user: User, token: string): Promise<User>;
    find(token: string): Promise<User>;
    findByUserName(userName: string): Promise<User>;
    update(user: User, token: string): Promise<User>;
}

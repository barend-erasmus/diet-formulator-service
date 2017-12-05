import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IUserRepository } from '../user';
import { User } from '../../entities/user';

export class UserRepository extends BaseRepository implements IUserRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(user: User, token: string): Promise<User> {

        const result: any = await BaseRepository.models.User.create({
            email: user.email,
            expiryTimestamp: new Date().getTime() + 3600000,
            picture: user.picture,
            token,
            verified: user.verified,
        });

        return user;
    }

    public async find(token: string): Promise<User> {

        const result: any = await BaseRepository.models.User.find({
            where: {
                token: {
                    [Sequelize.Op.eq]: token,
                },
                expiryTimestamp: {
                    [Sequelize.Op.gte]: new Date().getTime(),
                },
            },
        });

        if (!result) {
            return null;
        }
        
        return new User(result.email, result.verified, result.picture);
    }
}

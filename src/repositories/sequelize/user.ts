import * as Sequelize from 'sequelize';
import { User } from '../../entities/user';
import { IUserRepository } from '../user';
import { BaseRepository } from "./base";

export class UserRepository extends BaseRepository implements IUserRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(user: User, token: string): Promise<User> {

        const result: any = await BaseRepository.models.User.create({
            displayName: user.displayName,
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
                expiryTimestamp: {
                    [Sequelize.Op.gte]: new Date().getTime(),
                },
                token: {
                    [Sequelize.Op.eq]: token,
                },
            },
        });

        if (!result) {
            return null;
        }

        return new User(result.email, result.verified, result.picture, result.displayName, []);
    }
}

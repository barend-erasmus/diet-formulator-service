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
            country: user.country,
            displayName: user.displayName,
            email: user.email,
            expiryTimestamp: new Date().getTime() + 3600000,
            isSuperAdmin: user.isSuperAdmin,
            locale: user.locale,
            packageClass: user.packageClass,
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

        return new User(result.email, result.displayName, result.verified, result.picture, result.packageClass, result.isSuperAdmin, result.locale, result.country, []);
    }

    public async findByUsername(username: string): Promise<User> {

        const result: any[] = await BaseRepository.models.User.findAll({
            limit: 1,
            order: [ [ 'expiryTimestamp', 'DESC' ]],
            where: {
                email: {
                    [Sequelize.Op.eq]: username,
                },
                expiryTimestamp: {
                    [Sequelize.Op.gte]: new Date().getTime(),
                },
            },
        });

        if (result.length < 1) {
            return null;
        }

        return new User(result[0].email, result[0].displayName, result[0].verified, result[0].picture, result[0].packageClass, result[0].isSuperAdmin, result[0].locale, result[0].country, []);
    }

    public async update(user: User, token: string): Promise<User> {
        const result: any = await BaseRepository.models.User.find({
            where: {
                email: {
                    [Sequelize.Op.eq]: user.email,
                },
            },
        });

        result.expiryTimestamp = new Date().getTime() + 3600000;
        result.token = token;

        result.save();

        return user;
    }
}

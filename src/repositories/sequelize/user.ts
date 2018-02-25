import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { User } from '../../entities/user';
import { ICache } from '../../interfaces/cache';
import { ILogger } from '../../interfaces/logger';
import { IUserRepository } from '../user';
import { BaseRepository } from './base';

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
        logger: ILogger,
        cache: ICache,
    ) {
        super(host, userName, password, logger, cache);
    }

    public async create(user: User, token: string): Promise<User> {
        const result: any = await BaseRepository.models.User.create({
            country: user.country,
            displayName: user.displayName,
            email: user.email,
            expiryTimestamp: new Date().getTime() + 3600000,
            isSuperAdmin: user.isSuperAdmin,
            locale: user.locale,
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

        return this.mapToUser(result);
    }

    public async findByUserName(userName: string): Promise<User> {
        const result: any[] = await BaseRepository.models.User.findAll({
            limit: 1,
            order: [['expiryTimestamp', 'DESC']],
            where: {
                email: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        if (result.length < 1) {
            return null;
        }

        return this.mapToUser(result[0]);
    }

    public async update(user: User, token: string): Promise<User> {
        const result: any = await BaseRepository.models.User.find({
            where: {
                email: {
                    [Sequelize.Op.eq]: user.email,
                },
            },
        });

        result.country = user.country;
        result.displayName = user.displayName;
        result.locale = user.locale;
        result.picture = user.picture;
        result.verified = user.verified;
        result.isSuperAdmin = user.isSuperAdmin;

        result.expiryTimestamp = new Date().getTime() + 3600000;
        result.token = token;

        result.save();

        return user;
    }
}

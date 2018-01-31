import * as express from 'express';
import * as request from 'request-promise';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/sequelize/user';
import { IUserRepository } from '../repositories/user';
import { UserService } from '../services/user';
import { config } from './../config';
import { container } from '../ioc';

export class UserRouter {

    public static async info(req: express.Request, res: express.Response) {
        try {

            const token: string = req.get('Authorization').split(' ')[1];

            let user: User = await container.get<UserService>('UserService').find(token);

            if (!user) {
                try {
                    const json: any = await request({
                        headers: {
                            Authorization: req.get('Authorization'),
                        },
                        json: true,
                        uri: 'https://developersworkspace.auth0.com/userinfo',
                    });

                    user = await container.get<UserService>('UserService').login(new User(
                        json.email,
                        json.name,
                        json.email_verified,
                        json.picture,
                        json.user_metadata ? (json.user_metadata.packageClass ? json.user_metadata.packageClass : 'trial') : 'trial',
                        json.user_metadata ? (json.user_metadata.isSuperAdmin ? json.user_metadata.isSuperAdmin : false) : false,
                        json.locale,
                        json.country,
                        null,
                    ), token);

                    res.json(user);
                } catch (err) {
                    res.status(401).end();
                }
            } else {
                res.json(user);
            }

        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {

            const result: User = await container.get<UserService>('UserService').update(req.body, req.get('Authorization').split(' ')[1]);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }
}

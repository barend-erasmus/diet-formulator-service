import * as express from 'express';
import * as request from 'request-promise';
import { User } from '../entities/user';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { container } from '../ioc';
import { UserService } from '../services/user';
import { config } from './../config';

export class UserRouter {

    public static async info(req: express.Request, res: express.Response) {
        try {

            const token: string = UserRouter.getAuthorizationToken(req);

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
                        json.user_metadata ? (json.user_metadata.isSuperAdmin ? json.user_metadata.isSuperAdmin : false) : false,
                        json.locale,
                        json.country,
                    ), token);

                    res.json(user);
                } catch (err) {
                    res.status(401).end();
                }
            } else {
                res.json(user);
            }

        } catch (err) {
            res.status(500).json(err);
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

    private static getAuthorizationToken(req: express.Request): string {
        const authorizationHeader: string = req.get('Authorization');

        if (!authorizationHeader) {
            throw new WorldOfRationsError('invalid_token', 'Invalid token');
        }

        const splittedAuthorizationHeader: string[] = authorizationHeader.split(' ');

        if (splittedAuthorizationHeader.length !== 2 && splittedAuthorizationHeader[0].toLowerCase() === 'bearer') {
            throw new WorldOfRationsError('invalid_token', 'Invalid token');
        }

        return splittedAuthorizationHeader[1];
    }
}

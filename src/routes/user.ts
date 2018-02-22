import * as express from 'express';
import * as request from 'request-promise';
import { User } from '../entities/user';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { ICache } from '../interfaces/cache';
import { container } from '../ioc';
import { UserService } from '../services/user';

export class UserRouter {

    public static async info(req: express.Request, res: express.Response) {
        try {
            const token: string = UserRouter.getAuthorizationToken(req);

            let user: User = await container.get<ICache>('ICache').getUsingObjectKey({
                key: 'UserRouter.info',
                token,
            }, 'system');

            if (!user) {
                user = await container.get<UserService>('UserService').find(token);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    key: 'UserRouter.info',
                    token,
                }, user, null, 'system');
            }

            if (!user) {
                try {
                    const json: any = await request({
                        headers: {
                            Authorization: req.get('Authorization'),
                        },
                        json: true,
                        uri: 'https://worldofrations.auth0.com/userinfo',
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
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {
            const result: User = await container.get<UserService>('UserService').update(req.body, req.get('Authorization').split(' ')[1]);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
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

import * as express from 'express';
import * as request from 'request-promise';
import { CacheKeys } from '../constants/cache-keys';
import { User } from '../entities/user';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { ICache } from '../interfaces/cache';
import { container } from '../ioc';
import { UserService } from '../services/user';

export class UserRouter {

    public static async info(req: express.Request, res: express.Response) {
        try {
            const token: string = UserRouter.getAuthorizationToken(req);

            let user: User = await container.get<ICache>('ICache').getUsingObjectKey({
                key: CacheKeys.USER_ROUTER_FIND,
                token,
            }, CacheKeys.SYSTEM_USER_NAME);

            if (!user) {
                user = await container.get<UserService>('UserService').find(token);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    key: CacheKeys.USER_ROUTER_FIND,
                    token,
                }, user, null, CacheKeys.SYSTEM_USER_NAME);
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
                        ['worldofrations@gmail.com'].indexOf(json.email) > -1,
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
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {
            const result: User = await container.get<UserService>('UserService').update(req.body, req.get('Authorization').split(' ')[1]);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    private static getAuthorizationToken(req: express.Request): string {
        const authorizationHeader: string = req.get('Authorization');

        if (!authorizationHeader) {
            throw new DietFormulatorError('invalid_token', 'Invalid token');
        }

        const splittedAuthorizationHeader: string[] = authorizationHeader.split(' ');

        if (splittedAuthorizationHeader.length !== 2 && splittedAuthorizationHeader[0].toLowerCase() === 'bearer') {
            throw new DietFormulatorError('invalid_token', 'Invalid token');
        }

        return splittedAuthorizationHeader[1];
    }
}

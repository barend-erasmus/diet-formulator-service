import * as express from 'express';
import * as request from 'request-promise';
import { CacheKeys } from '../constants/cache-keys';
import { User } from '../entities/user';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { ICache } from '../interfaces/cache';
import { IGeoGateway } from '../interfaces/geo-gateway';
import { IOAuth2Gateway } from '../interfaces/oauth2-gateway';
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
                    const userInfo: any = await container.get<IOAuth2Gateway>('IOAuth2Gateway').getUserInfo(req.get('Authorization'));

                    const geoCode: string = req.get('X-Real-IP') ? await container.get<IGeoGateway>('IGeoGateway').getGeoCodeFromIPAddress(req.get('X-Real-IP')) : null;

                    user = await container.get<UserService>('UserService').login(new User(
                        userInfo.email,
                        userInfo.name,
                        userInfo.email_verified,
                        userInfo.picture,
                        ['worldofrations@gmail.com'].indexOf(userInfo.email) > -1 ? true : false,
                        userInfo.locale,
                        geoCode,
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

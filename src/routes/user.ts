import * as express from 'express';
import * as request from 'request-promise';
import { config } from './../config';
import { UserService } from '../services/user';
import { IUserRepository } from '../repositories/user';
import { UserRepository } from '../repositories/sequelize/user';
import { User } from '../entities/user';

export class UserRouter {

    public static async info(req: express.Request, res: express.Response) {
        try {

            const token: string = req.get('Authorization').split(' ')[1];

            let user: User = await UserRouter.getUserService().find(token);

            if (!user) {
                try {
                    const json: any = await request({
                        uri: 'https://developersworkspace.auth0.com/userinfo',
                        headers: {
                            'Authorization': req.get('Authorization'),
                        },
                        json: true,
                    });

                    user = await UserRouter.getUserService().create(new User(json.email, json.email_verified, json.picture), token);

                    res.json(user);
                } catch (err) {
                    res.status(401).end();
                }
            }else {
                res.json(user);
            }

            
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getUserService(): UserService {
        const userRepository: IUserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        const userService: UserService = new UserService(userRepository);

        return userService;
    }
}

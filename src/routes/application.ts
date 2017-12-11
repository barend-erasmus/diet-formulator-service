import * as express from 'express';
import { Application } from '../entities/application';
import { IApplicationRepository } from '../repositories/application';
import { ApplicationRepository } from '../repositories/sequelize/application';
import { UserRepository } from '../repositories/sequelize/user';
import { IUserRepository } from '../repositories/user';
import { ApplicationService } from '../services/application';
import { config } from './../config';

export class ApplicationRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Application = await ApplicationRouter.getApplicationService().create(req.body.name, req.body.description, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getApplicationService(): ApplicationService {
        const applicationRepository: IApplicationRepository = new ApplicationRepository(config.database.host, config.database.username, config.database.password);
        const userRepository: IUserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        const applicationService: ApplicationService = new ApplicationService(userRepository, applicationRepository);

        return applicationService;
    }
}

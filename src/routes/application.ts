import * as express from 'express';
import { Application } from '../entities/application';
import { IApplicationRepository } from '../repositories/application';
import { ApplicationRepository } from '../repositories/sequelize/application';
import { ApplicationService } from '../services/application';
import { config } from './../config';

export class ApplicationRouter {

    public static async create(req: express.Request, res: express.Response) {
        const result: Application = await ApplicationRouter.getApplicationService().create(req.body.name, req.body.description);

        res.json(result);
     }

    protected static getApplicationService(): ApplicationService {
        const applicationRepository: IApplicationRepository = new ApplicationRepository(config.database.host, config.database.username, config.database.password);
        const applicationService: ApplicationService = new ApplicationService(applicationRepository);

        return applicationService;
    }
}

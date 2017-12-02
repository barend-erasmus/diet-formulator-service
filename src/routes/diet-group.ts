import * as express from 'express';
import { config } from './../config';
import { DietGroupService } from '../services/diet-group';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietGroup } from '../entities/diet-group';

export class DietGroupRouter {

    public static async create(req: express.Request, res: express.Response) {
        const applicationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup = await DietGroupRouter.getDietGroupService().create(applicationId, req.body);

        res.json(result);
    }

    public static async find(req: express.Request, res: express.Response) {
        const applicationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup = await DietGroupRouter.getDietGroupService().find(applicationId, req.query.id);

        res.json(result);
    }

    public static async list(req: express.Request, res: express.Response) {
        const applicationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup[] = await DietGroupRouter.getDietGroupService().list(applicationId, req.query.dietGroupId? req.query.dietGroupId : null);

        res.json(result);
    }

    public static async listAll(req: express.Request, res: express.Response) {
        const applicationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup[] = await DietGroupRouter.getDietGroupService().listAll(applicationId);

        res.json(result);
    }

    public static async update(req: express.Request, res: express.Response) {
        const applicationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup = await DietGroupRouter.getDietGroupService().update(applicationId, req.body);

        res.json(result);
    }

    protected static getDietGroupService(): DietGroupService {
        const dietGroupRepository: IDietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);
        const dietGroupService: DietGroupService = new DietGroupService(dietGroupRepository);

        return dietGroupService;
    }
}

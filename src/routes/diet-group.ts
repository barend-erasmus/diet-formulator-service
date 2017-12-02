import * as express from 'express';
import { config } from './../config';
import { DietGroupService } from '../services/diet-group';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietGroup } from '../entities/diet-group';

export class DietGroupRouter {

    public static async create(req: express.Request, res: express.Response) {
        const appliationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup = await DietGroupRouter.getDietGroupService().create(appliationId, req.body);

        res.json(result);
    }

    public static async find(req: express.Request, res: express.Response) {
        const appliationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup = await DietGroupRouter.getDietGroupService().find(appliationId, req.query.id);

        res.json(result);
    }

    public static async list(req: express.Request, res: express.Response) {
        const appliationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup[] = await DietGroupRouter.getDietGroupService().list(1, req.query.dietGroupId? req.query.dietGroupId : null);

        res.json(result);
    }

    public static async listAll(req: express.Request, res: express.Response) {
        const appliationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup[] = await DietGroupRouter.getDietGroupService().listAll(1);

        res.json(result);
    }

    public static async update(req: express.Request, res: express.Response) {
        const appliationId: number = parseInt(req.get('x-application-id'));

        const result: DietGroup = await DietGroupRouter.getDietGroupService().update(appliationId, req.body);

        res.json(result);
    }

    protected static getDietGroupService(): DietGroupService {
        const dietGroupRepository: IDietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);
        const dietGroupService: DietGroupService = new DietGroupService(dietGroupRepository);

        return dietGroupService;
    }
}

import * as express from 'express';
import { config } from './../config';
import { DietGroupService } from '../services/diet-group';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietGroup } from '../entities/diet-group';

export class DietGroupRouter {

    public static async create(req: express.Request, res: express.Response) {
        const result: DietGroup = await DietGroupRouter.getDietGroupService().create(1, req.body);
 
        res.json(result);
     }

    public static async list(req: express.Request, res: express.Response) {
       const result: DietGroup[] = await DietGroupRouter.getDietGroupService().list(1);

       res.json(result);
    }

    protected static getDietGroupService(): DietGroupService {
        const dietGroupRepository: IDietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);
        const dietGroupService: DietGroupService = new DietGroupService(dietGroupRepository);

        return dietGroupService;
    }
}

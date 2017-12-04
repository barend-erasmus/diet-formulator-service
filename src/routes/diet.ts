import * as express from 'express';
import { Diet } from '../entities/diet';
import { IDietRepository } from '../repositories/diet';
import { DietRepository } from '../repositories/sequelize/diet';
import { DietService } from '../services/diet';
import { config } from './../config';

export class DietRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Diet = await DietRouter.getDietService().create(req.body);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: Diet[] = await DietRouter.getDietService().list(req.query.dietGroupId);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getDietService(): DietService {
        const dietRepository: IDietRepository = new DietRepository(config.database.host, config.database.username, config.database.password);
        const dietService: DietService = new DietService(dietRepository);

        return dietService;
    }
}

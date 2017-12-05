import * as express from 'express';
import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { DietValue } from '../entities/diet-value';
import { Nutrient } from '../entities/nutrient';
import { IDietRepository } from '../repositories/diet';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietRepository } from '../repositories/sequelize/diet';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { DietService } from '../services/diet';
import { config } from './../config';

export class DietRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: Diet = await DietRouter.getDietService().create(applicationId, new Diet(req.body.id, req.body.name, req.body.description, req.body.username, new DietGroup(req.body.group.id, req.body.group.name, req.body.group.description, null), req.body.values.map((value) => {
                return new DietValue(value.id, value.minimum !== undefined && value.minimum !== null && value.minimum !== '' ? parseFloat(value.minimum) : null, value.maximum !== undefined && value.maximum !== null && value.maximum !== '' ? parseFloat(value.maximum) : null, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder));
            })),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: Diet = await DietRouter.getDietService().find(req.query.id, req['user'].email);

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
            const result: Diet[] = await DietRouter.getDietService().list(req.query.dietGroupId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: Diet = await DietRouter.getDietService().update(applicationId, new Diet(req.body.id, req.body.name, req.body.description, req.body.username, new DietGroup(req.body.group.id, req.body.group.name, req.body.group.description, null), req.body.values.map((value) => {
                return new DietValue(value.id, value.minimum !== undefined && value.minimum !== null && value.minimum !== '' ? parseFloat(value.minimum) : null, value.maximum !== undefined && value.maximum !== null && value.maximum !== '' ? parseFloat(value.maximum) : null, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder));
            })),
                req['user'].email);

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
        const dietGroupRepository: IDietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);
        const dietService: DietService = new DietService(dietRepository, dietGroupRepository);

        return dietService;
    }
}

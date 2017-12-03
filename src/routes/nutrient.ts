import * as express from 'express';
import { config } from './../config';
import { Nutrient } from '../entities/nutrient';
import { NutrientService } from '../services/nutrient';
import { NutrientRepository } from '../repositories/sequelize/nutrient';
import { INutrientRepository } from '../repositories/nutrient';

export class NutrientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const applicationId: number = parseInt(req.get('x-application-id'));

            const result: Nutrient = await NutrientRouter.getNutrientService().create(applicationId, new Nutrient(null, req.body.name, req.body.description, req.body.code, req.body.abbreviation, req.body.unit, req.body.sortOrder));

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
            const applicationId: number = parseInt(req.get('x-application-id'));

            const result: Nutrient = await NutrientRouter.getNutrientService().find(applicationId, req.query.nutrientId);

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
            const applicationId: number = parseInt(req.get('x-application-id'));

            const result: Nutrient[] = await NutrientRouter.getNutrientService().list(applicationId);

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
            const applicationId: number = parseInt(req.get('x-application-id'));

            const result: Nutrient = await NutrientRouter.getNutrientService().update(applicationId, new Nutrient(null, req.body.name, req.body.description, req.body.code, req.body.abbreviation, req.body.unit, req.body.sortOrder));

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getNutrientService(): NutrientService {
        const nutrientRepository: INutrientRepository = new NutrientRepository(config.database.host, config.database.username, config.database.password);
        const nutrientService: NutrientService = new NutrientService(nutrientRepository);

        return nutrientService;
    }
}

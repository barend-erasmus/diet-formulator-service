import * as express from 'express';
import { Ingredient } from '../entities/ingredient';
import { IIngredientRepository } from '../repositories/ingredient';
import { IngredientRepository } from '../repositories/sequelize/ingredient';
import { IngredientService } from '../services/ingredient';
import { config } from './../config';

export class IngredientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Ingredient = await IngredientRouter.getIngredientService().create(req.body);

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
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: Ingredient[] = await IngredientRouter.getIngredientService().list(1);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getIngredientService(): IngredientService {
        const ingredientRepository: IIngredientRepository = new IngredientRepository(config.database.host, config.database.username, config.database.password);
        const ingredientService: IngredientService = new IngredientService(ingredientRepository);

        return ingredientService;
    }
}

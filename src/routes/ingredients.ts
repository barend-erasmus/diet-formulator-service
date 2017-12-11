import * as express from 'express';
import { Ingredient } from '../entities/ingredient';
import { IIngredientRepository } from '../repositories/ingredient';
import { IngredientRepository } from '../repositories/sequelize/ingredient';
import { UserRepository } from '../repositories/sequelize/user';
import { IUserRepository } from '../repositories/user';
import { IngredientService } from '../services/ingredient';
import { config } from './../config';

export class IngredientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Ingredient = await IngredientRouter.getIngredientService().create(req.body, req['user'].email);

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

            const result: Ingredient[] = await IngredientRouter.getIngredientService().list(1, req['user'].email);

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
        const userRepository: IUserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        const ingredientService: IngredientService = new IngredientService(userRepository, ingredientRepository);

        return ingredientService;
    }
}

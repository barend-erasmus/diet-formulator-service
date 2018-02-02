import * as express from 'express';
import { Ingredient } from '../entities/ingredient';
import { container } from '../ioc';
import { IIngredientRepository } from '../repositories/ingredient';
import { IngredientRepository } from '../repositories/sequelize/ingredient';
import { UserRepository } from '../repositories/sequelize/user';
import { IUserRepository } from '../repositories/user';
import { IngredientService } from '../services/ingredient';
import { config } from './../config';

export class IngredientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Ingredient = await container.get<IngredientService>('IngredientService').create(req.body, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {

            const result: Ingredient[] = await container.get<IngredientService>('IngredientService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

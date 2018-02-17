import * as express from 'express';
import { Ingredient } from '../entities/ingredient';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { container } from '../ioc';
import { IngredientService } from '../services/ingredient';

export class IngredientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Ingredient = await container.get<IngredientService>('IngredientService').create(req.body, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {

            const result: Ingredient[] = await container.get<IngredientService>('IngredientService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }
}

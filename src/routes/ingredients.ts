import * as express from 'express';
import { CacheKeys } from '../contants/cache-keys';
import { Ingredient } from '../entities/ingredient';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { ICache } from '../interfaces/cache';
import { container } from '../ioc';
import { IngredientService } from '../services/ingredient';

export class IngredientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Ingredient = await container.get<IngredientService>('IngredientService').create(req.body, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            let result: Ingredient[] = await container.get<ICache>('ICache').getUsingObjectKey({
                key: CacheKeys.INGREDIENT_ROUTER_LIST,
            }, req['user'].email);

            if (!result) {
                result = await container.get<IngredientService>('IngredientService').list(req['user'].email);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    key: CacheKeys.INGREDIENT_ROUTER_LIST,
                }, result, null, req['user'].email);
            }

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }
}

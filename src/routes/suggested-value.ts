import * as express from 'express';
import { Ingredient } from '../entities/ingredient';
import { SuggestedValue } from '../entities/suggested-value';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { container } from '../ioc';
import { IngredientService } from '../services/ingredient';
import { SuggestedValueService } from '../services/suggested-value';
import { config } from './../config';

export class SuggestedValueRouter {

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue = await container.get<SuggestedValueService>('SuggestedValueService').find(req.query.dietId, req.query.ingredientId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }
}

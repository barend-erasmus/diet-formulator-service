import * as express from 'express';

import { DietGroup } from '../entities/diet-group';
import { Ingredient } from '../entities/ingredient';
import { SuggestedValue } from '../entities/suggested-value';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { container } from '../ioc';
import { SuggestedValueService } from '../services/suggested-value';

export class SuggestedValueRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue = await container.get<SuggestedValueService>('SuggestedValueService').create(
                new SuggestedValue(
                    req.body.id,
                    req.body.description,
                    new DietGroup(req.body.dietGroup.id, null, null, null),
                    new Ingredient(req.body.ingredient.id, null, null, null, null, null),
                    req.body.minimum,
                    req.body.maximum,
                ),
                req['user'].email,
            );

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue = await container.get<SuggestedValueService>('SuggestedValueService').find(req.query.dietId, req.query.ingredientId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async findById(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue = await container.get<SuggestedValueService>('SuggestedValueService').findById(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue[] = await container.get<SuggestedValueService>('SuggestedValueService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async remove(req: express.Request, res: express.Response) {
        try {
            await container.get<SuggestedValueService>('SuggestedValueService').remove(req.query.suggestedValueId, req['user'].email);

            res.json();
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue = await container.get<SuggestedValueService>('SuggestedValueService').update(
                new SuggestedValue(
                    req.body.id,
                    req.body.description,
                    new DietGroup(req.body.dietGroup.id, null, null, null),
                    new Ingredient(req.body.ingredient.id, null, null, null, null, null),
                    req.body.minimum,
                    req.body.maximum,
                ),
                req['user'].email,
            );

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }
}

import * as express from 'express';
import { SuggestedValue } from '../entities/suggested-value';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { container } from '../ioc';
import { SuggestedValueService } from '../services/suggested-value';

export class SuggestedValueRouter {

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
}

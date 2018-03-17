import * as express from 'express';

import { Nutrient } from '../entities/nutrient';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { container } from '../ioc';
import { NutrientService } from '../services/nutrient';

export class NutrientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Nutrient = await container.get<NutrientService>('NutrientService').create(
                new Nutrient(null, req.body.name, req.body.description, req.body.code, req.body.abbreviation, req.body.unit, parseInt(req.body.sortOrder, undefined)),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: Nutrient = await container.get<NutrientService>('NutrientService').find(req.query.nutrientId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: Nutrient[] = await container.get<NutrientService>('NutrientService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {
            const result: Nutrient = await container.get<NutrientService>('NutrientService').update(
                new Nutrient(req.body.id, req.body.name, req.body.description, req.body.code, req.body.abbreviation, req.body.unit, parseInt(req.body.sortOrder, undefined)),
                req['user'].email,
            );

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }
}

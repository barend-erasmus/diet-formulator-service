import * as express from 'express';

import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { DietValue } from '../entities/diet-value';
import { Nutrient } from '../entities/nutrient';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { container } from '../ioc';
import { DietService } from '../services/diet';

export class DietRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Diet = await container.get<DietService>('DietService').create(new Diet(req.body.id, req.body.name, req.body.description, req.body.userName, new DietGroup(req.body.group.id, req.body.group.name, req.body.group.description, null), req.body.values.map((value) => {
                return new DietValue(value.id, value.minimum !== undefined && value.minimum !== null && value.minimum !== '' ? parseFloat(value.minimum) : null, value.maximum !== undefined && value.maximum !== null && value.maximum !== '' ? parseFloat(value.maximum) : null, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder));
            })),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: Diet = await container.get<DietService>('DietService').find(req.query.dietId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: Diet[] = await container.get<DietService>('DietService').list(req.query.dietGroupId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {
            const result: Diet = await container.get<DietService>('DietService').update(new Diet(req.body.id, req.body.name, req.body.description, req.body.userName, new DietGroup(req.body.group.id, req.body.group.name, req.body.group.description, null), req.body.values.map((value) => {
                return new DietValue(value.id, value.minimum !== undefined && value.minimum !== null && value.minimum !== '' ? parseFloat(value.minimum) : null, value.maximum !== undefined && value.maximum !== null && value.maximum !== '' ? parseFloat(value.maximum) : null, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder));
            })),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

}

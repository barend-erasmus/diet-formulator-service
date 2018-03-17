import * as express from 'express';

import { CacheKeys } from '../constants/cache-keys';
import { Diet } from '../entities/diet';
import { Formulation } from '../entities/formulation';
import { FormulationCompositionValue } from '../entities/formulation-composition-value';
import { FormulationIngredient } from '../entities/formulation-ingredient';
import { Ingredient } from '../entities/ingredient';
import { Supplement } from '../entities/supplement';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { ICache } from '../interfaces/cache';
import { container } from '../ioc';
import { FormulationService } from '../services/formulation';

export class FormulationRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Formulation = await container.get<FormulationService>('FormulationService').create(
                new Diet(req.body.diet.id, null, null, null, null, null),
                req.body.formulationIngredients.map((x) => new FormulationIngredient(null, new Ingredient(x.ingredient.id, null, null, null, null, null), x.cost, x.minimum, x.maximum, null)),
                req.body.mixWeight,
                req['user'].email);

            res.json({
                cost: result.cost,
                feasible: result.feasible,
                id: result.id,
            });
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            let result: Formulation = await container.get<ICache>('ICache').getUsingObjectKey({
                id: req.query.id,
                key: CacheKeys.FORMULATION_ROUTER_FIND,
            }, req['user'].email);

            if (!result) {
                result = await container.get<FormulationService>('FormulationService').find(req.query.formulationId, req['user'].email);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    id: req.query.id,
                    key: CacheKeys.FORMULATION_ROUTER_FIND,
                }, result, null, req['user'].email);
            }

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: Formulation[] = await container.get<FormulationService>('FormulationService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async supplement(req: express.Request, res: express.Response) {
        try {
            let result: Supplement[] = await container.get<ICache>('ICache').getUsingObjectKey({
                id: req.query.id,
                key: CacheKeys.FORMULATION_ROUTER_SUPPLEMENT,
            }, req['user'].email);

            if (!result) {
                result = await container.get<FormulationService>('FormulationService').supplement(req.query.formulationId, req['user'].email);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    id: req.query.id,
                    key: CacheKeys.FORMULATION_ROUTER_SUPPLEMENT,
                }, result, null, req['user'].email);
            }

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async composition(req: express.Request, res: express.Response) {
        try {
            let result: FormulationCompositionValue[] = await container.get<ICache>('ICache').getUsingObjectKey({
                id: req.query.id,
                key: CacheKeys.FORMULATION_ROUTER_COMPOSITION,
            }, req['user'].email);

            if (!result) {
                result = await container.get<FormulationService>('FormulationService').composition(req.query.formulationId, req['user'].email);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    id: req.query.id,
                    key: CacheKeys.FORMULATION_ROUTER_COMPOSITION,
                }, result, null, req['user'].email);
            }

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }
}

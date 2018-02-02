import * as express from 'express';
import { Diet } from '../entities/diet';
import { Formulation } from '../entities/formulation';
import { FormulationCompositionValue } from '../entities/formulation-composition-value';
import { FormulationIngredient } from '../entities/formulation-ingredient';
import { Ingredient } from '../entities/ingredient';
import { SuggestedValue } from '../entities/suggested-value';
import { Supplement } from '../entities/supplement';
import { container } from '../ioc';
import { FormulationService } from '../services/formulation';
import { config } from './../config';

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
            res.status(500).json(err);
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: Formulation = await container.get<FormulationService>('FormulationService').find(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: Formulation[] = await container.get<FormulationService>('FormulationService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    public static async suggestedValue(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue = await container.get<FormulationService>('FormulationService').suggestedValue(req.query.dietId, req.query.ingredientId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    public static async supplement(req: express.Request, res: express.Response) {
        try {
            const result: Supplement[] = await container.get<FormulationService>('FormulationService').supplement(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    public static async composition(req: express.Request, res: express.Response) {
        try {
            const result: FormulationCompositionValue[] = await container.get<FormulationService>('FormulationService').composition(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

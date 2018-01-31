import * as express from 'express';
import { Diet } from '../entities/diet';
import { Formulation } from '../entities/formulation';
import { FormulationCompositionValue } from '../entities/formulation-composition-value';
import { FormulationIngredient } from '../entities/formulation-ingredient';
import { Ingredient } from '../entities/ingredient';
import { SuggestedValue } from '../entities/suggested-value';
import { Supplement } from '../entities/supplement';
import { IDietRepository } from '../repositories/diet';
import { IFormulationRepository } from '../repositories/formulation';
import { IIngredientRepository } from '../repositories/ingredient';
import { DietRepository } from '../repositories/sequelize/diet';
import { FormulationRepository } from '../repositories/sequelize/formulation';
import { IngredientRepository } from '../repositories/sequelize/ingredient';
import { UserRepository } from '../repositories/sequelize/user';
import { IUserRepository } from '../repositories/user';
import { FormulatorService } from '../services/formulator';
import { config } from './../config';

export class FormulatorRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Formulation = await FormulatorRouter.getFormulatorService().createFormulation(
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
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: Formulation = await FormulatorRouter.getFormulatorService().find(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: Formulation[] = await FormulatorRouter.getFormulatorService().list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async suggestedValue(req: express.Request, res: express.Response) {
        try {
            const result: SuggestedValue = await FormulatorRouter.getFormulatorService().suggestedValue(req.query.dietId, req.query.ingredientId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async supplement(req: express.Request, res: express.Response) {
        try {
            const result: Supplement[] = await FormulatorRouter.getFormulatorService().supplement(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async composition(req: express.Request, res: express.Response) {
        try {
            const result: FormulationCompositionValue[] = await FormulatorRouter.getFormulatorService().composition(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getFormulatorService(): FormulatorService {
        const dietRepository: IDietRepository = new DietRepository(config.database.host, config.database.username, config.database.password);
        const ingredientRepository: IIngredientRepository = new IngredientRepository(config.database.host, config.database.username, config.database.password);
        const formulationRepository: IFormulationRepository = new FormulationRepository(config.database.host, config.database.username, config.database.password);
        const userRepository: IUserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        const formulatorService: FormulatorService = new FormulatorService(userRepository, dietRepository, ingredientRepository, formulationRepository, null);

        return formulatorService;
    }
}

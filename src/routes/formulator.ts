import * as express from 'express';
import { Formulation } from '../entities/formulation';
import { IDietRepository } from '../repositories/diet';
import { IIngredientRepository } from '../repositories/ingredient';
import { DietRepository } from '../repositories/sequelize/diet';
import { IngredientRepository } from '../repositories/sequelize/ingredient';
import { FormulatorService } from '../services/formulator';
import { config } from './../config';
import { IFormulationRepository } from '../repositories/formulation';
import { FormulationRepository } from '../repositories/sequelize/formulation';

export class FormulatorRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: Formulation = await FormulatorRouter.getFormulatorService().createFormulation(req.body.diet, req.body.formulationIngredients, req.body.mixWeight, req['user'].email);

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
            const result: Formulation = await FormulatorRouter.getFormulatorService().find(req.query.id, null);

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
        const formulatorService: FormulatorService = new FormulatorService(dietRepository, ingredientRepository, formulationRepository);

        return formulatorService;
    }
}

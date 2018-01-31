import * as express from 'express';
import { Nutrient } from '../entities/nutrient';
import { INutrientRepository } from '../repositories/nutrient';
import { NutrientRepository } from '../repositories/sequelize/nutrient';
import { UserRepository } from '../repositories/sequelize/user';
import { IUserRepository } from '../repositories/user';
import { NutrientService } from '../services/nutrient';
import { config } from './../config';
import { container } from '../ioc';

export class NutrientRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {

            const result: Nutrient = await container.get<NutrientService>('NutrientService').create(
                new Nutrient(null, req.body.name, req.body.description, req.body.code, req.body.abbreviation, req.body.unit, parseInt(req.body.sortOrder, undefined)),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {

            const result: Nutrient = await container.get<NutrientService>('NutrientService').find(req.query.nutrientId, req['user'].email);

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

            const result: Nutrient[] = await container.get<NutrientService>('NutrientService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
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
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }
}

import * as express from 'express';
import { DietGroup } from '../entities/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietGroupRepository } from '../repositories/sequelize/diet-group';
import { UserRepository } from '../repositories/sequelize/user';
import { IUserRepository } from '../repositories/user';
import { DietGroupService } from '../services/diet-group';
import { config } from './../config';

export class DietGroupRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: DietGroup = await DietGroupRouter.getDietGroupService().create(
                applicationId, new DietGroup(req.body.id, req.body.name, req.body.description, req.body.parent ?
                    new DietGroup(req.body.parent.id, req.body.parent.name, req.body.parent.description, null) :
                    null),
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
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: DietGroup = await DietGroupRouter.getDietGroupService().find(applicationId, req.query.id, req['user'].email);

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
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: DietGroup[] = await DietGroupRouter.getDietGroupService().list(applicationId, req.query.dietGroupId ? req.query.dietGroupId : null, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    public static async listAll(req: express.Request, res: express.Response) {
        try {
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: DietGroup[] = await DietGroupRouter.getDietGroupService().listAll(applicationId, req['user'].email);

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
            const applicationId: number = parseInt(req.get('x-application-id'), undefined);

            const result: DietGroup = await DietGroupRouter.getDietGroupService().update(
                applicationId,
                new DietGroup(req.body.id, req.body.name, req.body.description, req.body.parent ?
                    new DietGroup(req.body.parent.id, req.body.parent.name, req.body.parent.description, null) :
                    null),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }

    protected static getDietGroupService(): DietGroupService {
        const userRepository: IUserRepository = new UserRepository(config.database.host, config.database.username, config.database.password);
        const dietGroupRepository: IDietGroupRepository = new DietGroupRepository(config.database.host, config.database.username, config.database.password);
        const dietGroupService: DietGroupService = new DietGroupService(userRepository, dietGroupRepository);

        return dietGroupService;
    }
}

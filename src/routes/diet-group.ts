import * as express from 'express';
import { DietGroup } from '../entities/diet-group';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { container } from '../ioc';
import { DietGroupService } from '../services/diet-group';
import { config } from './../config';

export class DietGroupRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: DietGroup = await container.get<DietGroupService>('DietGroupService').create(new DietGroup(req.body.id, req.body.name, req.body.description, req.body.parent ?
                    new DietGroup(req.body.parent.id, req.body.parent.name, req.body.parent.description, null) :
                    null),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            const result: DietGroup = await container.get<DietGroupService>('DietGroupService').find(req.query.id, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: DietGroup[] = await container.get<DietGroupService>('DietGroupService').list(req.query.dietGroupId ? req.query.dietGroupId : null, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async listAll(req: express.Request, res: express.Response) {
        try {

            const result: DietGroup[] = await container.get<DietGroupService>('DietGroupService').listAll(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async update(req: express.Request, res: express.Response) {
        try {

            const result: DietGroup = await container.get<DietGroupService>('DietGroupService').update(
                new DietGroup(req.body.id, req.body.name, req.body.description, req.body.parent ?
                    new DietGroup(req.body.parent.id, req.body.parent.name, req.body.parent.description, null) :
                    null),
                req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }
}

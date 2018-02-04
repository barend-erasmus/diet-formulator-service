import * as express from 'express';
import { Subscription } from '../entities/subscription';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { container } from '../ioc';
import { SubscriptionService } from '../services/subscription';
import { config } from './../config';

export class SubscriptionRouter {

    public static async find(req: express.Request, res: express.Response) {
        try {

            const result: Subscription = await container.get<SubscriptionService>('SubscriptionService').find(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }
}

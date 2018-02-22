import * as express from 'express';
import { Subscription } from '../entities/subscription';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { ICache } from '../interfaces/cache';
import { container } from '../ioc';
import { SubscriptionService } from '../services/subscription';

export class SubscriptionRouter {

    public static async change(req: express.Request, res: express.Response) {
        try {
            const result: Subscription = await container.get<SubscriptionService>('SubscriptionService').change(req.query.subscription, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            let result: Subscription = await container.get<ICache>('ICache').getUsingObjectKey({
                key: 'SubscriptionRouter.find',
            }, req['user'].email);

            if (!result) {
                result = await container.get<SubscriptionService>('SubscriptionService').find(req['user'].email);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    key: 'SubscriptionRouter.find',
                }, result, null, req['user'].email);
            }

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }
}

import * as express from 'express';
import { CacheKeys } from '../constants/cache-keys';
import { Subscription } from '../entities/subscription';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { ICache } from '../interfaces/cache';
import { container } from '../ioc';
import { SubscriptionService } from '../services/subscription';
import { ILogger } from '../interfaces/logger';

export class SubscriptionRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: string = await container.get<SubscriptionService>('SubscriptionService').create(req.body.type, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async find(req: express.Request, res: express.Response) {
        try {
            let result: Subscription = await container.get<ICache>('ICache').getUsingObjectKey({
                key: CacheKeys.SUBSCRIPTION_ROUTER_FIND,
            }, req['user'].email);

            if (!result) {
                result = await container.get<SubscriptionService>('SubscriptionService').find(req['user'].email);

                await container.get<ICache>('ICache').addUsingObjectKey({
                    key: CacheKeys.SUBSCRIPTION_ROUTER_FIND,
                }, result, null, req['user'].email);
            }

            res.json(result);
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }

    public static async notify(req: express.Request, res: express.Response) {
        try {
            // await container.get<PaymentNotificationService>('PaymentNotificationService').create(req.body.m_payment_id, req.body.payment_status, req.body);
            container.get<ILogger>('RequestLogger').info('SubscriptionRouter.notify', req.body);
            
            res.json('OK');
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }
}

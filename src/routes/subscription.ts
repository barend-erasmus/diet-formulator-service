import * as express from 'express';
import { CacheKeys } from '../constants/cache-keys';
import { Subscription } from '../entities/subscription';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { ICache } from '../interfaces/cache';
import { ILogger } from '../interfaces/logger';
import { container } from '../ioc';
import { SubscriptionService } from '../services/subscription';

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
            // {
            //     "m_payment_id":"10",
            //     "pf_payment_id":"11471718",
            //     "payment_status":"COMPLETE",
            //     "item_name":"World of Rations Suite Subscription",
            //     "item_description":"STANDARD Subscription",
            //     "amount_gross":"5.00",
            //     "amount_fee":"-2.49",
            //     "amount_net":"2.51",
            //     "custom_str1":"",
            //     "custom_str2":"",
            //     "custom_str3":"",
            //     "custom_str4":"",
            //     "custom_str5":"",
            //     "custom_int1":"",
            //     "custom_int2":"",
            //     "custom_int3":"",
            //     "custom_int4":"",
            //     "custom_int5":"",
            //     "name_first":"bjcustomsoft@gmail.com",
            //     "name_last":"",
            //     "email_address":"bjcustomsoft@gmail.com",
            //     "merchant_id":"11223714",
            //     "token":"739d3fb4-644d-eef7-9998-fc4555150e52",
            //     "billing_date":"2018-03-05",
            //     "signature":"a3096732ad440365b850403f512fa919"
            //  }

            // await container.get<PaymentNotificationService>('PaymentNotificationService').create(req.body.m_payment_id, req.body.payment_status, req.body);
            container.get<ILogger>('RequestLogger').info('SubscriptionRouter.notify', req.body);

            res.json('OK');
        } catch (err) {
            res.status(500).json(DietFormulatorError.fromError(err));
        }
    }
}

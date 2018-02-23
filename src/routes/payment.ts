import * as express from 'express';
import * as fs from 'fs';
import { EventBus } from '../bus/event';
import { Payment } from '../entities/payment';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { PaymentNotificationEvent } from '../events/payment-notification';
import { container } from '../ioc';
import { PaymentService } from '../services/payment';
import { PaymentNotificationService } from '../services/payment-notification';

export class PaymentRouter {

    public static async create(req: express.Request, res: express.Response) {
        try {
            const result: string = await container.get<PaymentService>('PaymentService').createRedirectUrl(req.query.subscription, req['user'].email);

            res.json({
                uri: result,
            });
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async list(req: express.Request, res: express.Response) {
        try {
            const result: Payment[] = await container.get<PaymentService>('PaymentService').list(req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async notify(req: express.Request, res: express.Response) {
        try {
            await container.get<PaymentNotificationService>('PaymentNotificationService').create(req.body.m_payment_id, req.body.payment_status, req.body);

            res.json('OK');
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }

    public static async verify(req: express.Request, res: express.Response) {
        try {
            const result: Payment = await container.get<PaymentService>('PaymentService').verify(req.query.paymentId, req['user'].email);

            res.json(result);
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }
}

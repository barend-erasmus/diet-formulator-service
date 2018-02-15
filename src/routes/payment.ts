import * as express from 'express';
import * as fs from 'fs';
import { Payment } from '../entities/payment';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { container } from '../ioc';
import { IPaymentNotificationRepository } from '../repositories/payment-notification';
import { PaymentService } from '../services/payment';
import { config } from './../config';

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

            await container.get<IPaymentNotificationRepository>('IPaymentNotificationRepository').create(req.body.m_payment_id, req.body.payment_status);

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

import * as express from 'express';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { container } from '../ioc';
import { config } from './../config';
import { Payment } from '../entities/payment';
import { PaymentService } from '../services/payment';

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
}

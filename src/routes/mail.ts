import * as express from 'express';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { IMailSender } from '../interfaces/mail-sender';
import { container } from '../ioc';

export class MailRouter {

    public static async send(req: express.Request, res: express.Response) {
        try {
            const mailSender: IMailSender = container.get<IMailSender>('IMailSender');

            await mailSender.send(req.body.body, req.body.from, req.body.subject, req.body.to);

            res.json('OK');
        } catch (err) {
            res.status(500).json(WorldOfRationsError.fromError(err));
        }
    }
}

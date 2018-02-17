import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { IPaymentNotificationRepository } from '../payment-notification';
import { BaseRepository } from './base';

@injectable()
export class PaymentNotificationRepository extends BaseRepository implements IPaymentNotificationRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
    ) {
        super(host, userName, password);
    }

    public async create(paymentId: string, status: string): Promise<void> {

        const result: any = await BaseRepository.models.PaymentNotification.create({
            paymentId,
            status,
        });
    }

    public async status(paymentId: string): Promise<string> {

        const result: any = await BaseRepository.models.PaymentNotification.find({
            where: {
                paymentId: {
                    [Sequelize.Op.eq]: paymentId,
                },
            },
        });

        if (!result) {
            return null;
        }

        return result.status;
    }
}

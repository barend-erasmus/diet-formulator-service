import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { Payment } from '../../entities/payment';
import { IPaymentRepository } from '../payment';
import { BaseRepository } from './base';

@injectable()
export class PaymentRepository extends BaseRepository implements IPaymentRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
    ) {
        super(host, userName, password);
    }

    public async create(payment: Payment, userName: string): Promise<Payment> {

        const result: any = await BaseRepository.models.Payment.create({
            amount: payment.amount,
            assigned: payment.assigned,
            paid: payment.paid,
            paidTimestamp: payment.paidTimestamp ? payment.paidTimestamp.getTime() : null,
            paymentId: payment.paymentId,
            paymentUri: payment.redirectUri,
            period: payment.period,
            subscription: payment.subscription,
            userName,
        });

        return payment;
    }

    public async list(userName: string): Promise<Payment[]> {

        const result: any[] = await BaseRepository.models.Payment.findAll({
            where: {
                userName: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        return result.map((x) => new Payment(x.amount, x.assigned, x.paid, x.paidTimestamp ? new Date(x.paidTimestamp) : null, x.paymentId, x.period, x.paymentUri, x.subscription));
    }

    public async update(payment: Payment, userName: string): Promise<Payment> {

        return payment;
    }
}

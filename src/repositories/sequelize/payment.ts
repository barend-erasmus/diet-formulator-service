import { injectable } from 'inversify';
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
            currency: payment.currency,
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

    public async find(paymentId: string, userName: string): Promise<Payment> {
        const result: any = await BaseRepository.models.Payment.find({
            where: {
                paymentId: {
                    [Sequelize.Op.eq]: paymentId,
                },
                // userName: {
                //     [Sequelize.Op.eq]: userName,
                // },
            },
        });

        if (!result) {
            return null;
        }

        return this.mapToPayment(result);
    }

    public async list(userName: string): Promise<Payment[]> {
        const result: any[] = await BaseRepository.models.Payment.findAll({
            where: {
                userName: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        return result.map((x) => this.mapToPayment(x));
    }

    public async update(payment: Payment, userName: string): Promise<Payment> {
        const result: any = await BaseRepository.models.Payment.find({
            where: {
                paymentId: {
                    [Sequelize.Op.eq]: payment.paymentId,
                },
                // userName: {
                //     [Sequelize.Op.eq]: userName,
                // },
            },
        });

        result.assigned = payment.assigned;
        result.paid = payment.paid;
        result.paidTimestamp = payment.paidTimestamp ? payment.paidTimestamp.getTime() : null;

        await result.save();

        return payment;
    }
}

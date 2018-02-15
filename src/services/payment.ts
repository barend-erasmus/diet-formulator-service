import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Payment } from '../entities/payment';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { IForeignExchangeGateway } from '../interfaces/foreign-exchange-gateway';
import { IPaymentGateway } from '../interfaces/payment-gateway';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { IPaymentRepository } from '../repositories/payment';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class PaymentService extends BaseService {

    constructor(
        @inject('IForeignExchangeGateway')
        private foreignExchangeGateway: IForeignExchangeGateway,
        @inject('IPaymentRepository')
        private paymentRepository: IPaymentRepository,
        @inject('IPaymentGateway')
        private paymentGateway: IPaymentGateway,
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async createRedirectUrl(subscription: string, userName: string): Promise<string> {

        this.throwIfSubscriptionInvalid(subscription);

        let payment: Payment = await this.buildPayment(30, subscription);

        const user: User = await this.userRepository.findByUserName(userName);

        payment = await this.paymentGateway.create(payment, user);

        await this.paymentRepository.create(payment, userName);

        return payment.redirectUri;
    }

    public async list(userName: string): Promise<Payment[]> {

        await this.throwIfDoesNotHavePermission(userName, 'view-billing');

        return this.paymentRepository.list(userName);
    }

    public async verify(paymentId: string, userName: string): Promise<Payment> {

        const paid: boolean = await this.paymentGateway.verify(paymentId);

        if (!paid) {
            throw new WorldOfRationsError('not_paid', 'Payment has not been made');
        }

        const payment: Payment = await this.paymentRepository.find(paymentId, userName);

        payment.paid = paid;
        payment.paidTimestamp = new Date();

        return this.paymentRepository.update(payment, userName);
    }

    private async buildPayment(period: number, subscription: string): Promise<Payment> {

        const amount: number = this.getAmountOfSubscription(subscription);

        let payment: Payment = new Payment(amount, false, 'USD', false, null, null, 30, null, subscription);

        const defaultCurrency: string = await this.paymentGateway.defaultCurrency();

        payment = await this.convertPaymentToCurrency(defaultCurrency, payment);

        return payment;
    }

    private async convertPaymentToCurrency(currency: string, payment: Payment): Promise<Payment> {
        if (currency === payment.currency) {
            return payment;
        }

        payment.amount = await this.foreignExchangeGateway.convert(payment.amount, payment.currency, currency);
        payment.currency = currency;

        return payment;
    }

    private getAmountOfSubscription(subscription: string): number {
        let amount: number = null;

        switch (subscription) {
            case 'standard':
                amount = 9.95;
                break;
            case 'premium':
                amount = 19.95;
                break;
        }

        return amount;
    }

    private throwIfSubscriptionInvalid(subscription: string): void {
        if (subscription !== 'standard' && subscription !== 'premium') {
            throw new WorldOfRationsError('invalid_subscription', 'Invalid subscription');
        }
    }
}

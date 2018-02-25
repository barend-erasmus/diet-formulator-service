import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Payment } from '../entities/payment';
import { User } from '../entities/user';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { IForeignExchangeGateway } from '../interfaces/foreign-exchange-gateway';
import { IPaymentGateway } from '../interfaces/payment-gateway';
import { IPaymentRepository } from '../repositories/payment';
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
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
        super();
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
            throw new DietFormulatorError('not_paid', 'Payment has not been made');
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
                amount = 39.95;
                break;
            case 'premium':
                amount = 64.95;
                break;
        }

        return amount;
    }

    private throwIfSubscriptionInvalid(subscription: string): void {
        if (subscription !== 'standard' && subscription !== 'premium') {
            throw new DietFormulatorError('invalid_subscription', 'Invalid subscription');
        }
    }
}

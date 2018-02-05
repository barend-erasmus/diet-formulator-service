import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';
import { Payment } from '../entities/payment';
import { IPaymentRepository } from '../repositories/payment';
import { IPaymentGateway } from '../interfaces/payment-gateway';
import { WorldOfRationsError } from '../errors/world-of-rations-error';

@injectable()
export class PaymentService extends BaseService {

    constructor(
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

        let amount: number = null;

        switch (subscription) {
            case 'standard':
                amount = 9.95;
                break;
            case 'premium':
                amount = 19.95;
                break;
        }

        let payment: Payment = new Payment(amount, false, null, null, 30, null, subscription);

        payment = await this.paymentGateway.create(payment);

        await this.paymentRepository.create(payment, userName);

        return payment.redirectUri;
    }

    private throwIfSubscriptionInvalid(subscription: string): void {
        if (subscription !== 'standard' && subscription !== 'premium') {
            throw new WorldOfRationsError('invalid_subscription', 'Invalid subscription');
        }
    }
}

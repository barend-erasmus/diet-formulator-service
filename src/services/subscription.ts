import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { EventBus } from '../bus/event';
import { Payment } from '../entities/payment';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { SubscriptionEvent } from '../events/subscription';
import { SubscriptionChangedEvent } from '../events/subscription-changed';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { IPaymentRepository } from '../repositories/payment';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class SubscriptionService extends BaseService {

    constructor(
        @inject('IPaymentRepository')
        private paymentRepository: IPaymentRepository,
        @inject('SubscriptionEventBus')
        private subscriptionEventBus: EventBus<SubscriptionEvent>,
        @inject('ISubscriptionRepository')
        private subscriptionRepository: ISubscriptionRepository,
        @inject('ISubscriptionFactory')
        private subscriptionFactory: ISubscriptionFactory,
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
        super();
    }

    public async change(subscription: string, userName: string): Promise<Subscription> {
        const payment: Payment = null;

        if (this.requiresPayment(subscription)) {
            await this.assignPaymentToSubscription(subscription, userName);
        }

        await this.deactivateCurrentSubscription(userName);

        const newSubscription: Subscription = await this.subscriptionRepository.create(this.subscriptionFactory.create(true, this.getExpiryDateForSubscription(subscription, payment ? payment.period : null), new Date(), subscription), userName);

        this.subscriptionEventBus.publish(new SubscriptionChangedEvent(userName));

        return newSubscription;
    }

    public async find(userName: string): Promise<Subscription> {
        const user: User = await this.userRepository.findByUserName(userName);

        if (user.isSuperAdmin) {
            return this.subscriptionFactory.create(true, null, null, 'super-admin');
        }

        return this.subscriptionRepository.find(userName);
    }

    private async assignPaymentToSubscription(subscription: string, userName: string): Promise<void> {
        const payments: Payment[] = await this.paymentRepository.list(userName);

        const payment: Payment = payments.find((x) => x.subscription === subscription && !x.assigned && x.paid);

        if (!payment) {
            throw new DietFormulatorError('no_payment_for_subscription', 'No Payment for this subscription');
        }

        payment.assigned = true;

        await this.paymentRepository.update(payment, userName);
    }

    private async deactivateCurrentSubscription(userName: string): Promise<void> {
        const currentSubscription: Subscription = await this.subscriptionRepository.find(userName);

        if (currentSubscription) {
            currentSubscription.active = false;

            await this.subscriptionRepository.update(currentSubscription, userName);
        }
    }

    private getExpiryDateForSubscription(subscription: string, period: number): Date {
        if (period) {
            return moment().add(period, 'days').toDate();
        }

        switch (subscription) {
            case 'trial':
                return null;
            case 'basic':
                return null;
            case 'standard':
                return moment().add(1, 'month').toDate();
            case 'premium':
                return moment().add(1, 'month').toDate();
        }
    }

    private requiresPayment(subscription: string): boolean {
        if (subscription !== 'trial' && subscription !== 'basic') {
            return true;
        }

        return false;
    }
}

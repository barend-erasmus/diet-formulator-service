import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { EventBus } from '../bus/event';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { SubscriptionEvent } from '../events/subscription';
import { SubscriptionActivatedEvent } from '../events/subscription-activated';
import { IForeignExchangeGateway } from '../interfaces/foreign-exchange-gateway';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { ISubscriptionGateway } from '../interfaces/subscription-gateway';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class SubscriptionService extends BaseService {

    constructor(
        @inject('IForeignExchangeGateway')
        private foreignExchangeGateway: IForeignExchangeGateway,
        @inject('SubscriptionEventBus')
        private subscriptionEventBus: EventBus<SubscriptionEvent>,
        @inject('ISubscriptionRepository')
        private subscriptionRepository: ISubscriptionRepository,
        @inject('ISubscriptionFactory')
        private subscriptionFactory: ISubscriptionFactory,
        @inject('ISubscriptionGateway')
        private subscriptionGateway: ISubscriptionGateway,
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
        super();
    }

    public async activate(subscriptionId: number, token: string, userName: string): Promise<Subscription> {
        await this.deactivateCurrentSubscription(userName);

        let subscription: Subscription = await this.subscriptionRepository.findById(subscriptionId, userName);

        subscription.active = true;
        subscription.token = token;

        subscription = await this.subscriptionRepository.update(subscription, userName);

        this.subscriptionEventBus.publish(new SubscriptionActivatedEvent(userName));

        return subscription;
    }

    public async create(type: string, userName: string): Promise<string> {
        const user: User = await this.userRepository.findByUserName(userName);

        let subscription: Subscription = this.subscriptionFactory.create(false, this.getEndDateForSubscription(type, null), null, new Date(), null, type);

        subscription = await this.subscriptionRepository.create(subscription, userName);

        if (!this.requiresPayment(type)) {
            subscription = await this.activate(subscription.id, null, userName);
            return null;
        }

        const usdAmount: number = this.getAmountOfSubscription(type);

        const zarAmount: number = await this.foreignExchangeGateway.convert(usdAmount, 'USD', 'ZAR');

        return this.subscriptionGateway.createRedirectURI(zarAmount, subscription, user);
    }

    public async find(userName: string): Promise<Subscription> {
        const user: User = await this.userRepository.findByUserName(userName);

        if (user.isSuperAdmin) {
            return this.subscriptionFactory.create(true, null, null, null, null, 'super-admin');
        }

        return this.subscriptionRepository.find(userName);
    }

    private async deactivateCurrentSubscription(userName: string): Promise<void> {
        const subscription: Subscription = await this.subscriptionRepository.find(userName);

        if (subscription) {
            subscription.active = false;
            subscription.endTimestamp = new Date();

            await this.subscriptionRepository.update(subscription, userName);

            // TODO: Cancel Subscription through Gateway
        }
    }

    private getAmountOfSubscription(type: string): number {
        let amount: number = null;

        switch (type) {
            case 'standard':
                amount = 39.95;
                break;
            case 'premium':
                amount = 64.95;
                break;
        }

        return amount;
    }

    private getEndDateForSubscription(type: string, period: number): Date {
        if (period) {
            return moment().add(period, 'days').toDate();
        }

        switch (type) {
            case 'trial':
                return moment().add(14, 'days').toDate();
            case 'basic':
                return null;
            case 'standard':
                return null;
            case 'premium':
                return null;
        }
    }

    private requiresPayment(subscription: string): boolean {
        if (subscription !== 'trial' && subscription !== 'basic') {
            return true;
        }

        return false;
    }
}

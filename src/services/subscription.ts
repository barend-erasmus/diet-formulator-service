import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { EventBus } from '../bus/event';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { DietFormulatorError } from '../errors/diet-formulator-error';
import { SubscriptionEvent } from '../events/subscription';
import { SubscriptionActivatedEvent } from '../events/subscription-activated';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { ISubscriptionGateway } from '../interfaces/subscription-gateway';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class SubscriptionService extends BaseService {

    constructor(
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

    public async activate(subscriptionId: number, userName: string): Promise<Subscription> {
        await this.deactivateCurrentSubscription(userName);

        let subscription: Subscription = await this.subscriptionRepository.findById(subscriptionId, userName);

        subscription.active = true;

        subscription = await this.subscriptionRepository.update(subscription, userName);

        this.subscriptionEventBus.publish(new SubscriptionActivatedEvent(userName));

        return subscription;
    }

    public async create(type: string, userName: string): Promise<string> {
        const user: User = await this.userRepository.findByUserName(userName);

        let subscription: Subscription = await this.subscriptionRepository.create(this.subscriptionFactory.create(false, null, null, new Date(), type), userName);

        if (!this.requiresPayment(type)) {
            subscription = await this.activate(subscription.id, userName);
            return null;
        }

        return this.subscriptionGateway.createRedirectURI(this.getAmountOfSubscription(type), subscription, user);
    }

    public async find(userName: string): Promise<Subscription> {
        const user: User = await this.userRepository.findByUserName(userName);

        if (user.isSuperAdmin) {
            return this.subscriptionFactory.create(true, null, null, null, 'super-admin');
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

    private requiresPayment(subscription: string): boolean {
        if (subscription !== 'trial' && subscription !== 'basic') {
            return true;
        }

        return false;
    }
}

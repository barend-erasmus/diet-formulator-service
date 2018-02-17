import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BasicSubscription } from '../entities/basic-subscription';
import { PremiumSubscription } from '../entities/premium-subscription';
import { StandardSubscription } from '../entities/standard-subscription';
import { Subscription } from '../entities/subscription';
import { SuperAdminSubscription } from '../entities/super-admin-subscription';
import { TrialSubscription } from '../entities/trail-subscription';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';

@injectable()
export class SubscriptionFactory implements ISubscriptionFactory {

    public create(active: boolean, expiryTimestamp: Date, startTimestamp: Date, type: string): Subscription {

        let subscription: Subscription = null;

        switch (type) {
            case 'trial':
                subscription = new TrialSubscription(active, [], expiryTimestamp, startTimestamp);
                break;
            case 'basic':
                subscription = new BasicSubscription(active, [], expiryTimestamp, startTimestamp);
                break;
            case 'standard':
                subscription = new StandardSubscription(active, [], expiryTimestamp, startTimestamp);
                break;
            case 'premium':
                subscription = new PremiumSubscription(active, [], expiryTimestamp, startTimestamp);
                break;
            case 'super-admin':
                subscription = new SuperAdminSubscription(active, [], expiryTimestamp, startTimestamp);
                break;
        }

        if (!this.validSubscription(subscription)) {
            subscription.setPermissions([
                'view-profile',
                'update-profile',
                'view-formulation',
                'view-billing',
            ]);

            subscription.expired = true;
        }

        return subscription;
    }

    private validSubscription(subscription: Subscription): boolean {

        if (subscription.expiryTimestamp && subscription.expiryTimestamp.getTime() < new Date().getTime()) {
            return false;
        }

        if (subscription.startTimestamp && subscription.startTimestamp.getTime() >= new Date().getTime()) {
            return false;
        }

        return true;
    }
}

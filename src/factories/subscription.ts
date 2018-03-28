import { injectable } from 'inversify';
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

    public create(active: boolean, endTimestamp: Date, id: number, startTimestamp: Date, token: string, type: string): Subscription {
        let subscription: Subscription = null;

        switch (type.toLowerCase()) {
            case 'trial':
                subscription = new TrialSubscription(active, [], endTimestamp, false, id, startTimestamp, token);
                break;
            case 'basic':
                subscription = new BasicSubscription(active, [], endTimestamp, false, id, startTimestamp, token);
                break;
            case 'standard':
                subscription = new StandardSubscription(active, [], endTimestamp, false, id, startTimestamp, token);
                break;
            case 'premium':
                subscription = new PremiumSubscription(active, [], endTimestamp, false, id, startTimestamp, token);
                break;
            case 'super-admin':
                subscription = new SuperAdminSubscription(active, [], null, false, id, null, null);
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
        if (subscription.endTimestamp && subscription.endTimestamp.getTime() < new Date().getTime()) {
            return false;
        }

        if (subscription.startTimestamp && subscription.startTimestamp.getTime() >= new Date().getTime()) {
            return false;
        }

        return true;
    }

}

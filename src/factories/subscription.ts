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

    public create(active: boolean, endTimestamp: Date, id: number, startTimestamp: Date, type: string): Subscription {
        let subscription: Subscription = null;

        switch (type) {
            case 'trial':
                subscription = new TrialSubscription(active, [], endTimestamp, id, startTimestamp);
                break;
            case 'basic':
                subscription = new BasicSubscription(active, [], endTimestamp, id, startTimestamp);
                break;
            case 'standard':
                subscription = new StandardSubscription(active, [], endTimestamp, id, startTimestamp);
                break;
            case 'premium':
                subscription = new PremiumSubscription(active, [], endTimestamp, id, startTimestamp);
                break;
            case 'super-admin':
                subscription = new SuperAdminSubscription(active, [], null,  id, null);
                break;
        }

        if (!subscription.active) {
            subscription.setPermissions([
                'view-profile',
                'update-profile',
                'view-formulation',
                'view-billing',
            ]);
        }

        return subscription;
    }
}

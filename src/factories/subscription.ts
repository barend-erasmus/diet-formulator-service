import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ISubscription } from '../interfaces/subscription';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { BasicSubscription } from '../subscriptions/basic';
import { PremiumSubscription } from '../subscriptions/premium';
import { StandardSubscription } from '../subscriptions/standard';
import { SuperAdminSubscription } from '../subscriptions/super-admin';
import { TrialSubscription } from '../subscriptions/trail';

@injectable()
export class SubscriptionFactory implements ISubscriptionFactory {

    public create(type: string, isSuperAdmin: boolean): ISubscription {

        if (isSuperAdmin) {
            return new SuperAdminSubscription([]);
        }

        switch (type) {
            case 'trial':
                return new TrialSubscription([]);
            case 'basic':
                return new BasicSubscription([]);
            case 'standard':
                return new StandardSubscription([]);
            case 'premium':
                return new PremiumSubscription([]);
            default:
                return null;
        }
    }
}

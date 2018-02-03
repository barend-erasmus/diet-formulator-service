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

    public create(active: boolean, expiryTimestamp: Date, type: string, isSuperAdmin: boolean): Subscription {

        if (isSuperAdmin) {
            return new SuperAdminSubscription(active, expiryTimestamp, []);
        }

        switch (type) {
            case 'trial':
                return new TrialSubscription(active, expiryTimestamp, []);
            case 'basic':
                return new BasicSubscription(active, expiryTimestamp, []);
            case 'standard':
                return new StandardSubscription(active, expiryTimestamp, []);
            case 'premium':
                return new PremiumSubscription(active, expiryTimestamp, []);
            default:
                return null;
        }
    }
}

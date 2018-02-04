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

        switch (type) {
            case 'trial':
                return new TrialSubscription(active, expiryTimestamp, expiryTimestamp, []);
            case 'basic':
                return new BasicSubscription(active, expiryTimestamp, expiryTimestamp, []);
            case 'standard':
                return new StandardSubscription(active, expiryTimestamp, expiryTimestamp, []);
            case 'premium':
                return new PremiumSubscription(active, expiryTimestamp, expiryTimestamp, []);
            case 'super-admin':
                return new SuperAdminSubscription(active, expiryTimestamp, expiryTimestamp, []);
            default:
                return null;
        }
    }
}

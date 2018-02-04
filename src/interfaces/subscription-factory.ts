import { Subscription } from '../entities/subscription';

export interface ISubscriptionFactory {
    create(active: boolean, expiryTimestamp: Date, startTimestamp: Date, type: string): Subscription;
}

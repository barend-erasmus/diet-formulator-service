import { Subscription } from '../entities/subscription';

export interface ISubscriptionFactory {
    create(active: boolean, expiryTimestamp: Date, type: string, isSuperAdmin: boolean): Subscription;
}

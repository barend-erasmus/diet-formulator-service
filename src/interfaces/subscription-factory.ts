import { Subscription } from '../entities/subscription';

export interface ISubscriptionFactory {
    create(active: boolean, endTimestamp: Date, id: number, startTimestamp: Date, type: string): Subscription;
}

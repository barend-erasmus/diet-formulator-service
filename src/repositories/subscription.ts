import { Subscription } from '../entities/subscription';
import { IBaseRepository } from './base';

export interface ISubscriptionRepository extends IBaseRepository {
    create(subscription: Subscription, userName: string): Promise<Subscription>;
    find(userName: string): Promise<Subscription>;
    update(subscription: Subscription, userName: string): Promise<Subscription>;
}

import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';

export interface ISubscriptionGateway {
    cancel(subscriptionId: string): Promise<boolean>;
    createRedirectURI(amount: number, subscription: Subscription, user: User): Promise<string>;
    notify(subscriptionId: string): Promise<boolean>;
}

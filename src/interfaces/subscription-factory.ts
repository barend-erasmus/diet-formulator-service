import { ISubscription } from "../interfaces/subscription";

export interface ISubscriptionFactory {
    create(type: string, isSuperAdmin: boolean): ISubscription;
}
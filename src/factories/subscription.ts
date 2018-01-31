import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TrialSubscription } from "../subscriptions/trail";
import { BasicSubscription } from "../subscriptions/basic";
import { StandardSubscription } from "../subscriptions/standard";
import { PremiumSubscription } from "../subscriptions/premium";
import { SuperAdminSubscription } from "../subscriptions/super-admin";
import { ISubscriptionFactory } from "../interfaces/subscription-factory";
import { ISubscription } from "../interfaces/subscription";

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
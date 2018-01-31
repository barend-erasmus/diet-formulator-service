import { User } from "../entities/user";
import { IUserRepository } from "../repositories/user";
import { InsufficientPermissionsError } from "../errors/insufficient-permissions-error";
import { ISubscription } from "../interfaces/subscription";
import { TrialSubscription } from "../subscriptions/trail";
import { BasicSubscription } from "../subscriptions/basic";
import { StandardSubscription } from "../subscriptions/standard";
import { PremiumSubscription } from "../subscriptions/premium";
import { SuperAdminSubscription } from "../subscriptions/super-admin";
import { ISubscriptionFactory } from "../interfaces/subscription-factory";

export class BaseService {

    constructor(
        private subscriptionFactory: ISubscriptionFactory,
        protected userRepository: IUserRepository,
    ) {

    }

    protected async getSubscription(username: string): Promise<ISubscription> {

        const user: User = await this.userRepository.findByUsername(username);

        return this.subscriptionFactory.create(user.subscriptionType, user.isSuperAdmin);
    }

    protected async hasPermission(username: string, permission: string): Promise<boolean> {
        const subscription: ISubscription = await this.getSubscription(username);

        return subscription.hasPermission(permission);
    }

    protected async throwIfDoesNotHavePermission(userName: string, permission: string): Promise<void> {
        if (!await this.hasPermission(userName, permission)) {
            throw new InsufficientPermissionsError('insufficient_permissions', 'Insufficient permissions', permission, userName);
        }
    }
}

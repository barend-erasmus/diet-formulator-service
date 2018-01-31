import { User } from "../entities/user";
import { IUserRepository } from "../repositories/user";
import { InsufficientPermissionsError } from "../errors/insufficient-permissions-error";
import { ISubscription } from "../interfaces/subscription";
import { TrialSubscription } from "../subscriptions/trail";
import { BasicSubscription } from "../subscriptions/basic";
import { StandardSubscription } from "../subscriptions/standard";
import { PremiumSubscription } from "../subscriptions/premium";
import { SuperAdminSubscription } from "../subscriptions/super-admin";

export class BaseService {

    constructor(
        protected userRepository: IUserRepository,
    ) {

    }

    protected async getSubscription(username: string): Promise<ISubscription> {

        const user: User = await this.userRepository.findByUsername(username);

        let subscription: ISubscription = null;

        if (user.subscriptionType === 'trial') {
            subscription = new TrialSubscription([]);
        }

        if (user.subscriptionType === 'basic') {
            subscription = new BasicSubscription([]);
        }

        if (user.subscriptionType === 'standard') {
            subscription = new StandardSubscription([]);
        }

        if (user.subscriptionType === 'premium') {
            subscription = new PremiumSubscription([]);
        }

        if (user.isSuperAdmin) {
            subscription = new SuperAdminSubscription([]);
        }

        return subscription;
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

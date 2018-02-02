import { inject, injectable, unmanaged } from 'inversify';
import 'reflect-metadata';
import { User } from '../entities/user';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { ISubscription } from '../interfaces/subscription';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { IUserRepository } from '../repositories/user';
import { BasicSubscription } from '../subscriptions/basic';
import { PremiumSubscription } from '../subscriptions/premium';
import { StandardSubscription } from '../subscriptions/standard';
import { SuperAdminSubscription } from '../subscriptions/super-admin';
import { TrialSubscription } from '../subscriptions/trail';

@injectable()
export class BaseService {

    constructor(
        @unmanaged()
        protected subscriptionFactory: ISubscriptionFactory,
        @unmanaged()
        protected userRepository: IUserRepository,
    ) {

    }

    protected async getSubscription(userName: string): Promise<ISubscription> {

        const user: User = await this.userRepository.findByUsername(userName);

        return this.subscriptionFactory.create(user.subscriptionType, user.isSuperAdmin);
    }

    protected async hasPermission(userName: string, permission: string): Promise<boolean> {
        const subscription: ISubscription = await this.getSubscription(userName);

        return subscription.hasPermission(permission);
    }

    protected async throwIfDoesNotHavePermission(userName: string, permission: string): Promise<void> {
        if (!await this.hasPermission(userName, permission)) {
            throw new InsufficientPermissionsError('insufficient_permissions', 'Insufficient permissions', permission, userName);
        }
    }
}

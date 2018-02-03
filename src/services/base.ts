import { inject, injectable, unmanaged } from 'inversify';
import 'reflect-metadata';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { IUserRepository } from '../repositories/user';
@injectable()
export class BaseService {

    constructor(
        @unmanaged()
        protected subscriptionFactory: ISubscriptionFactory,
        @unmanaged()
        protected userRepository: IUserRepository,
    ) {

    }

    protected async getSubscription(userName: string): Promise<Subscription> {

        // const user: User = await this.userRepository.findByUsername(userName);

        // return this.subscriptionFactory.create(user.subscriptionType, user.isSuperAdmin);

        // TODO: Get subscription for repository
        return null;
    }

    protected async hasPermission(userName: string, permission: string): Promise<boolean> {
        const subscription: Subscription = await this.getSubscription(userName);

        return subscription.hasPermission(permission);
    }

    protected async throwIfDoesNotHavePermission(userName: string, permission: string): Promise<void> {
        if (!await this.hasPermission(userName, permission)) {
            throw new InsufficientPermissionsError('insufficient_permissions', 'Insufficient permissions', permission, userName);
        }
    }
}

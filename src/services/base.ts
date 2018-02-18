import { inject, injectable, unmanaged } from 'inversify';
import 'reflect-metadata';
import { DietGroup } from '../entities/diet-group';
import { Subscription } from '../entities/subscription';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';

@injectable()
export class BaseService {

    constructor(
        @unmanaged()
        protected subscriptionRepository: ISubscriptionRepository,
        @unmanaged()
        protected userRepository: IUserRepository,
    ) {

    }

    protected async hasPermission(userName: string, permission: string): Promise<boolean> {
        const subscription: Subscription = await this.subscriptionRepository.find(userName);

        return subscription.hasPermission(permission);
    }

    protected async cleanList<T>(list: T[], userName: string, fn: (obj: T, userName: string) => Promise<T>): Promise<T[]> {

        for (let obj of list) {
            obj = await fn(obj, userName);
        }

        return list;
    }

    protected async cleanDietGroup(dietGroup: DietGroup, userName: string): Promise<DietGroup> {
        return dietGroup;
    }

    protected async throwIfDoesNotHavePermission(userName: string, permission: string): Promise<void> {
        if (!await this.hasPermission(userName, permission)) {
            throw new InsufficientPermissionsError('insufficient_permissions', 'Insufficient permissions', permission, userName);
        }
    }
}

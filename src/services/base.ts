import { inject, injectable, unmanaged } from 'inversify';
import 'reflect-metadata';
import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { Ingredient } from '../entities/ingredient';
import { Subscription } from '../entities/subscription';
import { SuggestedValue } from '../entities/suggested-value';
import { User } from '../entities/user';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { container } from '../ioc';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';

@injectable()
export class BaseService {

    private SubscriptionFactory: ISubscriptionFactory = null;
    private SubscriptionRepository: ISubscriptionRepository = null;
    private UserRepository: IUserRepository = null;

    constructor() {
        this.SubscriptionFactory = container.get<ISubscriptionFactory>('ISubscriptionFactory');
        this.SubscriptionRepository = container.get<ISubscriptionRepository>('ISubscriptionRepository');
        this.UserRepository = container.get<IUserRepository>('IUserRepository');
    }

    protected async hasPermission(userName: string, permission: string): Promise<boolean> {
        const user: User = await this.UserRepository.findByUserName(userName);

        const subscription: Subscription = user.isSuperAdmin ?
            await this.SubscriptionFactory.create(true, null, null, null, 'super-admin') :
            await this.SubscriptionRepository.find(userName);

        return subscription.hasPermission(permission);
    }

    protected async cleanDiet(diet: Diet, userName: string, self?: BaseService): Promise<Diet> {
        if (!self) {
            self = this;
        }

        if (!self.hasPermission(userName, 'view-diet-values')) {
            diet.removeValues();
        }

        if (!await self.hasPermission(userName, 'super-user')) {
            diet.clearUserName();
        }

        return diet;
    }

    protected async cleanDietGroup(dietGroup: DietGroup, userName: string, self?: BaseService): Promise<DietGroup> {
        if (!self) {
            self = this;
        }

        return dietGroup;
    }

    protected async cleanIngredient(ingredient: Ingredient, userName: string, self?: BaseService): Promise<Ingredient> {
        if (!self) {
            self = this;
        }

        if (!await self.hasPermission(userName, 'view-ingedient-values')) {
            ingredient.removeValues();
        }

        return ingredient;
    }

    protected async cleanList<T>(list: T[], userName: string, fn: (obj: T, userName: string, self?: BaseService) => Promise<T>): Promise<T[]> {
        for (let obj of list) {
            obj = await fn(obj, userName, this);
        }

        return list;
    }

    protected async cleanSuggestedValue(suggestedValue: SuggestedValue, userName: string, self?: BaseService): Promise<SuggestedValue> {
        if (!self) {
            self = this;
        }

        suggestedValue.ingredient = await self.cleanIngredient(suggestedValue.ingredient, userName, self);

        return suggestedValue;
    }

    protected async throwIfDoesNotHavePermission(userName: string, permission: string): Promise<void> {
        if (!await this.hasPermission(userName, permission)) {
            throw new InsufficientPermissionsError('insufficient_permissions', 'Insufficient permissions', permission, userName);
        }
    }
}

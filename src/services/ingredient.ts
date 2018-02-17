import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Ingredient } from '../entities/ingredient';
import { IIngredientRepository } from '../repositories/ingredient';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class IngredientService extends BaseService {

    constructor(
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
        @inject('IIngredientRepository')
        private ingredientRepository: IIngredientRepository,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async create(
        ingredient: Ingredient,
        userName: string,
    ): Promise<Ingredient> {

        if (!await this.hasPermission(userName, 'create-ingredient')) {
            throw new Error('Unauthorized');
        }

        ingredient.validate();

        return this.ingredientRepository.create(ingredient);
    }

    public async list(
        userName: string,
    ): Promise<Ingredient[]> {

        if (!await this.hasPermission(userName, 'view-ingredient')) {
            throw new Error('Unauthorized');
        }

        return this.ingredientRepository.list();
    }
}

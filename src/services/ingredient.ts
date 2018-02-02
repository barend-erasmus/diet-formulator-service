import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Ingredient } from '../entities/ingredient';
import { IIngredientRepository } from '../repositories/ingredient';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';
import { ISubscriptionFactory } from "../interfaces/subscription-factory";

@injectable()
export class IngredientService extends BaseService {

    constructor(
        @inject("ISubscriptionFactory")
        subscriptionFactory: ISubscriptionFactory,
        @inject("IUserRepository")
        userRepository: IUserRepository,
        @inject("IIngredientRepository")
        private ingredientRepository: IIngredientRepository,
    ) {
        super(subscriptionFactory, userRepository);
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

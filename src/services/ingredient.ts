import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Ingredient } from '../entities/ingredient';
import { IIngredientRepository } from '../repositories/ingredient';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';

@injectable()
export class IngredientService extends BaseService {

    constructor(
        @inject("IUserRepository")
        userRepository: IUserRepository,
        @inject("IIngredientRepository")
        private ingredientRepository: IIngredientRepository,
    ) {
        super(userRepository);
    }

    public async create(
        ingredient: Ingredient,
        username: string,
    ): Promise<Ingredient> {

        if (!await this.hasPermission(username, 'create-ingredient')) {
            throw new Error('Unauthorized');
        }

        ingredient.validate();

        return this.ingredientRepository.create(ingredient);
    }

    public async list(
        username: string,
    ): Promise<Ingredient[]> {

        if (!await this.hasPermission(username, 'view-ingredient')) {
            throw new Error('Unauthorized');
        }

        return this.ingredientRepository.list();
    }
}

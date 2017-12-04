import { config } from './../config';
import { IIngredientRepository } from '../repositories/ingredient';
import { Ingredient } from '../entities/ingredient';

export class IngredientService {

    constructor(
        private ingredientRepository: IIngredientRepository,
    ) {

    }

    public async create(
        ingredient: Ingredient,
    ): Promise<Ingredient> {

        ingredient.validate();

        return this.ingredientRepository.create(ingredient);
    }

    public async list(
        applicationId: number,
    ): Promise<Ingredient[]> {
        return this.ingredientRepository.list(applicationId);
    }
}

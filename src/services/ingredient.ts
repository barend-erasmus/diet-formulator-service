import { Ingredient } from '../entities/ingredient';
import { IIngredientRepository } from '../repositories/ingredient';
import { config } from './../config';

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

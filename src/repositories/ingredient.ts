import { Ingredient } from "../entities/ingredient";

export interface IIngredientRepository {
    create(ingredient: Ingredient): Promise<Ingredient>;
    find(ingredientId: number): Promise<Ingredient>;
    list(applicationId: number): Promise<Ingredient[]>;
}

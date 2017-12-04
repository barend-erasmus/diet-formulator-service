import { Ingredient } from "../entities/ingredient";

export interface IIngredientRepository {
    create(ingredient: Ingredient): Promise<Ingredient>;
    list(applicationId: number): Promise<Ingredient[]>;
}
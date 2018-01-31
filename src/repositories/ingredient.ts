import { Ingredient } from "../entities/ingredient";

export interface IIngredientRepository {
    create(ingredient: Ingredient): Promise<Ingredient>;
    find(ingredientId: number): Promise<Ingredient>;
    listSupplements(nutrientId: number): Promise<Ingredient[]>;
    list(): Promise<Ingredient[]>;
}

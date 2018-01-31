import { IngredientGroup } from "../entities/ingredient-group";

export interface IIngredientGroupRepository {
    create(ingredientGroup: IngredientGroup): Promise<IngredientGroup>;
    list(): Promise<IngredientGroup[]>;
}

import { IngredientGroup } from "../entities/ingredient-group";

export interface IIngredientGroupRepository {
    create(applicationId: number, ingredientGroup: IngredientGroup): Promise<IngredientGroup>;
    list(applicationId: number): Promise<IngredientGroup[]>;
}

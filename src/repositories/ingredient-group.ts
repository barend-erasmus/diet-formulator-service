import { IngredientGroup } from '../entities/ingredient-group';
import { IBaseRepository } from './base';

export interface IIngredientGroupRepository extends IBaseRepository {
    create(ingredientGroup: IngredientGroup): Promise<IngredientGroup>;
    list(): Promise<IngredientGroup[]>;
}

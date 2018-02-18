import { Ingredient } from '../entities/ingredient';
import { IBaseRepository } from './base';

export interface IIngredientRepository extends IBaseRepository {
    create(ingredient: Ingredient): Promise<Ingredient>;
    find(ingredientId: number): Promise<Ingredient>;
    list(): Promise<Ingredient[]>;
    listSupplements(nutrientId: number): Promise<Ingredient[]>;
}

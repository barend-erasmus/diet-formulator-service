import { Nutrient } from '../entities/nutrient';
import { IBaseRepository } from './base';

export interface INutrientRepository extends IBaseRepository {
    create(nutrient: Nutrient): Promise<Nutrient>;
    find(code: string): Promise<Nutrient>;
    findById(nutrientId: number): Promise<Nutrient>;
    list(): Promise<Nutrient[]>;
    update(nutrient: Nutrient): Promise<Nutrient>;
}

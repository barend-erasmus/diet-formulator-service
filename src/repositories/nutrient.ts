import { Nutrient } from "../entities/nutrient";

export interface INutrientRepository {
    create(nutrient: Nutrient): Promise<Nutrient>;
    find(code: string): Promise<Nutrient>;
    findById(nutrientId: number): Promise<Nutrient>;
    list(): Promise<Nutrient[]>;
    update(nutrient: Nutrient): Promise<Nutrient>;
}

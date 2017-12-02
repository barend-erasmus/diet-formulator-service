import { Nutrient } from "../entities/nutrient";

export interface INutrientRepository {
    create(applicationId: number, nutrient: Nutrient): Promise<Nutrient>;
    find(applicationId: number, code: string): Promise<Nutrient>;
    findById(applicationId: number, nutrientId: number): Promise<Nutrient>;
    list(applicationId: number): Promise<Nutrient[]>;
    update(applicationId: number, nutrient: Nutrient): Promise<Nutrient>;
}
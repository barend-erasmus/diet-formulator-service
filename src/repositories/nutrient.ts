import { Nutrient } from "../entities/nutrient";

export interface INutrientRepository {
    create(applicationId: number, nutrient: Nutrient): Promise<Nutrient>;
    find(applicationId: number, code: string): Promise<Nutrient>;
}
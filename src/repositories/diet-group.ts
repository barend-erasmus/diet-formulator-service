import { DietGroup } from "../entities/diet-group";

export interface IDietGroupRepository {
    create(applicationId: number, dietGroup: DietGroup): Promise<DietGroup>;
    list(applicationId: number): Promise<DietGroup[]>;
}
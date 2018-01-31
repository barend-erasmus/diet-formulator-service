import { DietGroup } from "../entities/diet-group";

export interface IDietGroupRepository {
    create(dietGroup: DietGroup): Promise<DietGroup>;
    find(dietGroupId: number): Promise<DietGroup>;
    list(): Promise<DietGroup[]>;
    listSubGroups( dietGroupId: number): Promise<DietGroup[]>;
    update(dietGroup: DietGroup): Promise<DietGroup>;
}

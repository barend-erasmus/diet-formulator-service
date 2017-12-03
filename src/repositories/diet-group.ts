import { DietGroup } from "../entities/diet-group";

export interface IDietGroupRepository {
    create(applicationId: number, dietGroup: DietGroup): Promise<DietGroup>;
    find(applicationId: number, dietGroupId: number): Promise<DietGroup>;
    list(applicationId: number): Promise<DietGroup[]>;
    listSubGroups(applicationId: number, dietGroupId: number): Promise<DietGroup[]>;
    update(applicationId: number, dietGroup: DietGroup): Promise<DietGroup>;
}

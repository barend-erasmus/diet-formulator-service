import { DietGroup } from '../entities/diet-group';
import { IBaseRepository } from './base';

export interface IDietGroupRepository extends IBaseRepository {
    create(dietGroup: DietGroup): Promise<DietGroup>;
    find(dietGroupId: number): Promise<DietGroup>;
    list(): Promise<DietGroup[]>;
    listSubGroups(dietGroupId: number): Promise<DietGroup[]>;
    update(dietGroup: DietGroup): Promise<DietGroup>;
}

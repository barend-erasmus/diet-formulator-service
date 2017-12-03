import { DietGroup } from '../entities/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { config } from './../config';

export class DietGroupService {

    constructor(
        private dietGroupRepository: IDietGroupRepository,
    ) {

    }

    public async create(
        applicationId: number,
        dietGroup: DietGroup,
    ): Promise<DietGroup> {

        return this.dietGroupRepository.create(applicationId, dietGroup);
    }

    public async find(
        applicationId: number,
        dietGroupId: number,
    ): Promise<DietGroup> {

        return this.dietGroupRepository.find(applicationId, dietGroupId);
    }

    public async list(
        applicationId: number,
        dietGroupId: number,
    ): Promise<DietGroup[]> {
        return this.dietGroupRepository.listSubGroups(applicationId, dietGroupId);
    }

    public async listAll(
        applicationId: number,
    ): Promise<DietGroup[]> {
        return this.dietGroupRepository.list(applicationId);
    }

    public async update(
        applicationId: number,
        dietGroup: DietGroup,
    ): Promise<DietGroup> {

        return this.dietGroupRepository.update(applicationId, dietGroup);
    }

}

import { config } from './../config';
import { IDietGroupRepository } from '../repositories/diet-group';
import { DietGroup } from '../entities/diet-group';

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

    public async list(
        applicationId: number,
    ): Promise<DietGroup[]> {
        return this.dietGroupRepository.list(applicationId);
    }

   
}

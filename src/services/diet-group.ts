import { DietGroup } from '../entities/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { config } from './../config';
import { BaseService } from './base';
import { IUserRepository } from '../repositories/user';

export class DietGroupService extends BaseService {

    constructor(
        userRepository: IUserRepository,
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(userRepository);
    }

    public async create(
        applicationId: number,
        dietGroup: DietGroup,
        username: string,
    ): Promise<DietGroup> {

        if (!await this.hasPermission(username, 'create-diet-group')) {
            throw new Error('Unauthorized');
        }

        dietGroup.validate();

        return this.dietGroupRepository.create(applicationId, dietGroup);
    }

    public async find(
        applicationId: number,
        dietGroupId: number,
        username: string,
    ): Promise<DietGroup> {

        if (!await this.hasPermission(username, 'view-diet-group')) {
            throw new Error('Unauthorized');
        }

        return this.dietGroupRepository.find(applicationId, dietGroupId);
    }

    public async list(
        applicationId: number,
        dietGroupId: number,
        username: string,
    ): Promise<DietGroup[]> {
        if (!await this.hasPermission(username, 'view-diet-group')) {
            throw new Error('Unauthorized');
        }

        return this.dietGroupRepository.listSubGroups(applicationId, dietGroupId);
    }

    public async listAll(
        applicationId: number,
        username: string,
    ): Promise<DietGroup[]> {
        if (!await this.hasPermission(username, 'view-diet-group')) {
            throw new Error('Unauthorized');
        }

        return this.dietGroupRepository.list(applicationId);
    }

    public async update(
        applicationId: number,
        dietGroup: DietGroup,
        username: string,
    ): Promise<DietGroup> {

        if (!await this.hasPermission(username, 'update-diet-group')) {
            throw new Error('Unauthorized');
        }

        dietGroup.validate();

        return this.dietGroupRepository.update(applicationId, dietGroup);
    }

}

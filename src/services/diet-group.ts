import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DietGroup } from '../entities/diet-group';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { IDietGroupRepository } from '../repositories/diet-group';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';

@injectable()
export class DietGroupService extends BaseService {

    constructor(
        @inject('ISubscriptionRepository')
        protected subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
        @inject('IDietGroupRepository')
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async create(
        dietGroup: DietGroup,
        userName: string,
    ): Promise<DietGroup> {

        await this.throwIfDoesNotHavePermission(userName, 'create-diet-group');

        dietGroup.validate();

        return this.dietGroupRepository.create(dietGroup);
    }

    public async find(
        dietGroupId: number,
        userName: string,
    ): Promise<DietGroup> {

        await this.throwIfDoesNotHavePermission(userName, 'view-diet-group');

        return this.dietGroupRepository.find(dietGroupId);
    }

    public async list(
        dietGroupId: number,
        userName: string,
    ): Promise<DietGroup[]> {

        await this.throwIfDoesNotHavePermission(userName, 'view-diet-group');

        return this.dietGroupRepository.listSubGroups(dietGroupId);
    }

    public async listAll(
        userName: string,
    ): Promise<DietGroup[]> {

        await this.throwIfDoesNotHavePermission(userName, 'view-diet-group');

        return this.dietGroupRepository.list();
    }

    public async update(
        dietGroup: DietGroup,
        userName: string,
    ): Promise<DietGroup> {

        await this.throwIfDoesNotHavePermission(userName, 'update-diet-group');

        dietGroup.validate();

        return this.dietGroupRepository.update(dietGroup);
    }

}

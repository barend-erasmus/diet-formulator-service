import "reflect-metadata";
import { injectable, inject } from "inversify";
import { DietGroup } from '../entities/diet-group';
import { IDietGroupRepository } from '../repositories/diet-group';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';
import { InsufficientPermissionsError } from "../errors/insufficient-permissions-error";
import { ISubscriptionFactory } from "../interfaces/subscription-factory";

@injectable()
export class DietGroupService extends BaseService {

    constructor(
        @inject("ISubscriptionFactory")
        subscriptionFactory: ISubscriptionFactory,
        @inject("IUserRepository")
        userRepository: IUserRepository,
        @inject("IDietGroupRepository")
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(subscriptionFactory, userRepository);
    }

    public async create(
        dietGroup: DietGroup,
        username: string,
    ): Promise<DietGroup> {

        await this.throwIfDoesNotHavePermission(username, 'create-diet-group');

        dietGroup.validate();

        return this.dietGroupRepository.create(dietGroup);
    }

    public async find(
        dietGroupId: number,
        username: string,
    ): Promise<DietGroup> {

        await this.throwIfDoesNotHavePermission(username, 'view-diet-group');

        return this.dietGroupRepository.find(dietGroupId);
    }

    public async list(
        dietGroupId: number,
        username: string,
    ): Promise<DietGroup[]> {
        
        await this.throwIfDoesNotHavePermission(username, 'view-diet-group');

        return this.dietGroupRepository.listSubGroups(dietGroupId);
    }

    public async listAll(
        username: string,
    ): Promise<DietGroup[]> {
        
        await this.throwIfDoesNotHavePermission(username, 'view-diet-group');

        return this.dietGroupRepository.list();
    }

    public async update(
        dietGroup: DietGroup,
        username: string,
    ): Promise<DietGroup> {

        await this.throwIfDoesNotHavePermission(username, 'update-diet-group');

        dietGroup.validate();

        return this.dietGroupRepository.update(dietGroup);
    }

}

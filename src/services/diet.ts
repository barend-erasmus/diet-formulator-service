import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { IDietRepository } from '../repositories/diet';
import { IDietGroupRepository } from '../repositories/diet-group';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';
import { InsufficientPermissionsError } from "../errors/insufficient-permissions-error";
import { ISubscriptionFactory } from "../interfaces/subscription-factory";

export class DietService extends BaseService {

    constructor(
        @inject("ISubscriptionFactory")
        subscriptionFactory: ISubscriptionFactory,
        @inject("IUserRepository")
        userRepository: IUserRepository,
        @inject("IDietRepository")
        private dietRepository: IDietRepository,
        @inject("IDietGroupRepository")
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(subscriptionFactory, userRepository);
    }

    public async create(
        diet: Diet,
        username: string,
    ): Promise<Diet> {

        await this.throwIfDoesNotHavePermission(username, 'create-diet');

        diet.setUserName(username);

        diet.validate();

        this.throwIfDietNotUserDefinedGroupWithoutSuperUserPermission(username, diet.group.id);

        diet = await this.clearUserNameIfSuperUser(username, diet);

        diet = await this.dietRepository.create(diet);

        await this.removeDietValuesIfNotHaveViewDietValuesPermission(username, diet);

        return diet;
    }

    public async find(
        dietId: number,
        username: string,
    ): Promise<Diet> {

        await this.throwIfDoesNotHavePermission(username, 'view-diet');

        const diet: Diet = await this.dietRepository.find(dietId);

        await this.removeDietValuesIfNotHaveViewDietValuesPermission(username, diet);

        return diet;
    }

    public async list(
        dietGroupId: number,
        username: string,
    ): Promise<Diet[]> {

        await this.throwIfDoesNotHavePermission(username, 'view-diet');

        return this.dietRepository.list(dietGroupId, username);
    }

    public async update(
        diet: Diet,
        username: string,
    ): Promise<Diet> {

        diet.setUserName(username);

        await this.throwIfDoesNotHavePermission(username, 'create-diet');

        diet.validate();

        this.throwIfDietNotUserDefinedGroupWithoutSuperUserPermission(username, diet.group.id);

        if (!await this.hasPermission(username, 'super-user')) {

            const existingDiet: Diet = await this.dietRepository.find(diet.id);

            if (existingDiet.username === username) {
                throw new InsufficientPermissionsError('insufficient_permissions', `Non super users can only update their own diets`, 'super-user', username);
            }
        } 

        diet = await this.clearUserNameIfSuperUser(username, diet);

        diet = await this.dietRepository.update(diet);

        await this.removeDietValuesIfNotHaveViewDietValuesPermission(username, diet);

        return diet;
    }

    private async clearUserNameIfSuperUser(userName: string, diet: Diet): Promise<Diet> {
        if (!await this.hasPermission(userName, 'super-user')) {
            diet.clearUserName();
        }

        return diet;
    }

    private async removeDietValuesIfNotHaveViewDietValuesPermission(userName: string, diet: Diet): Promise<void> {
        if (!await this.hasPermission(userName, 'view-diet-values')) {
            diet.removeValues();
        }
    }

    private async throwIfDietNotUserDefinedGroupWithoutSuperUserPermission(userName: string, dietGroupId: number): Promise<void> {
        if (!await this.hasPermission(userName, 'super-user')) {
            const dietGroup: DietGroup = await this.dietGroupRepository.find(dietGroupId);

            if (dietGroup.name !== 'User Defined') {
                throw new InsufficientPermissionsError('insufficient_permissions', `Non super users can only create/update diets under the 'User Defined' group`, 'super-user', userName);
            }
        }
    }

}

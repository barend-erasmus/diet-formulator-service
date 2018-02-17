import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { InsufficientPermissionsError } from '../errors/insufficient-permissions-error';
import { IDietRepository } from '../repositories/diet';
import { IDietGroupRepository } from '../repositories/diet-group';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class DietService extends BaseService {

    constructor(
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
        @inject('IDietRepository')
        private dietRepository: IDietRepository,
        @inject('IDietGroupRepository')
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async create(
        diet: Diet,
        userName: string,
    ): Promise<Diet> {

        await this.throwIfDoesNotHavePermission(userName, 'create-diet');

        diet.setUserName(userName);

        diet.validate();

        this.throwIfDietNotUserDefinedGroupWithoutSuperUserPermission(userName, diet.group.id);

        diet = await this.clearUserNameIfSuperUser(userName, diet);

        diet = await this.dietRepository.create(diet);

        diet = await this.removeDietValuesIfNotHaveViewDietValuesPermission(userName, diet);

        return diet;
    }

    public async find(
        dietId: number,
        userName: string,
    ): Promise<Diet> {

        await this.throwIfDoesNotHavePermission(userName, 'view-diet');

        let diet: Diet = await this.dietRepository.find(dietId);

        diet = await this.removeDietValuesIfNotHaveViewDietValuesPermission(userName, diet);

        return diet;
    }

    public async list(
        dietGroupId: number,
        userName: string,
    ): Promise<Diet[]> {

        await this.throwIfDoesNotHavePermission(userName, 'view-diet');

        return this.dietRepository.list(dietGroupId, userName);
    }

    public async update(
        diet: Diet,
        userName: string,
    ): Promise<Diet> {

        diet.setUserName(userName);

        await this.throwIfDoesNotHavePermission(userName, 'create-diet');

        diet.validate();

        this.throwIfDietNotUserDefinedGroupWithoutSuperUserPermission(userName, diet.group.id);

        if (!await this.hasPermission(userName, 'super-user')) {

            const existingDiet: Diet = await this.dietRepository.find(diet.id);

            if (existingDiet.userName === userName) {
                throw new InsufficientPermissionsError('insufficient_permissions', `Non super users can only update their own diets`, 'super-user', userName);
            }
        }

        diet = await this.clearUserNameIfSuperUser(userName, diet);

        diet = await this.dietRepository.update(diet);

        diet = await this.removeDietValuesIfNotHaveViewDietValuesPermission(userName, diet);

        return diet;
    }

    private async clearUserNameIfSuperUser(userName: string, diet: Diet): Promise<Diet> {
        if (!await this.hasPermission(userName, 'super-user')) {
            diet.clearUserName();
        }

        return diet;
    }

    private async removeDietValuesIfNotHaveViewDietValuesPermission(userName: string, diet: Diet): Promise<Diet> {
        if (!await this.hasPermission(userName, 'view-diet-values')) {
            diet.removeValues();
        }

        return diet;
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

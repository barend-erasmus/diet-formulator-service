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

export class DietService extends BaseService {

    constructor(
        @inject("IUserRepository")
        userRepository: IUserRepository,
        @inject("IDietRepository")
        private dietRepository: IDietRepository,
        @inject("IDietGroupRepository")
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(userRepository);
    }

    public async create(
        diet: Diet,
        username: string,
    ): Promise<Diet> {

        await this.throwIfDoesNotHavePermission(username, 'create-diet');

        diet.setUserName(username);

        diet.validate();

        this.throwIfDietUnderDietGroupWithoutSuperAdminPermission(username, diet.group.id);

        if (await this.hasPermission(username, 'super-user')) {
            diet.clearUserName();
        }

        diet = await this.dietRepository.create(diet);

        if (!await this.hasPermission(username, 'view-diet-values')) {
            diet.removeValues();
        }

        return diet;
    }

    public async find(
        dietId: number,
        username: string,
    ): Promise<Diet> {

        await this.throwIfDoesNotHavePermission(username, 'view-diet');

        const diet: Diet = await this.dietRepository.find(dietId);

        if (!await this.hasPermission(username, 'view-diet-values')) {
            diet.removeValues();
        }

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

        diet.username = username;

        await this.throwIfDoesNotHavePermission(username, 'create-diet');

        diet.validate();

        if (!await this.hasPermission(username, 'super-user')) {

            const existingDiet: Diet = await this.dietRepository.find(diet.id);

            if (existingDiet.username === username) {
                throw new InsufficientPermissionsError('insufficient_permissions', `Non super users can only update their own diets`, 'super-user', username);
            }

            const dietGroup: DietGroup = await this.dietGroupRepository.find(diet.group.id);

            if (dietGroup.name !== 'User Defined') {
                throw new InsufficientPermissionsError('insufficient_permissions', `Non super users can only update diets under the 'User Defined' group`, 'super-user', username);
            }

        } else {
            diet.clearUserName();
        }

        diet = await this.dietRepository.update(diet);

        if (!await this.hasPermission(username, 'view-diet-values')) {
            diet.removeValues();
        }

        return diet;
    }

    private async throwIfDietUnderDietGroupWithoutSuperAdminPermission(userName: string, dietGroupId: number): Promise<void> {
        if (!await this.hasPermission(userName, 'super-user')) {
            const dietGroup: DietGroup = await this.dietGroupRepository.find(dietGroupId);

            if (dietGroup.name !== 'User Defined') {
                throw new InsufficientPermissionsError('insufficient_permissions', `Non super users can only update diets under the 'User Defined' group`, 'super-user', userName);
            }
        }
    }

}

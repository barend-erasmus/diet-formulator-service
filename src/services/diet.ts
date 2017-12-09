import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { IDietRepository } from '../repositories/diet';
import { IDietGroupRepository } from '../repositories/diet-group';
import { IUserRepository } from '../repositories/user';
import { config } from './../config';
import { BaseService } from './base';

export class DietService extends BaseService {

    constructor(
        userRepository: IUserRepository,
        private dietRepository: IDietRepository,
        private dietGroupRepository: IDietGroupRepository,
    ) {
        super(userRepository);
    }

    public async create(
        applicationId: number,
        diet: Diet,
        username: string,
    ): Promise<Diet> {

        diet.username = username;

        if (!await this.hasPermission(username, 'create-diet')) {
            throw new Error('Unauthorized');
        }

        diet.validate();

        if (!await this.hasPermission(username, 'super-user')) {
            const dietGroup: DietGroup = await this.dietGroupRepository.find(applicationId, diet.group.id);

            if (dietGroup.name !== 'User Defined') {
                throw new Error(`Non super users can only update diets under the 'User Defined' group`);
            }
        }

        if (this.hasPermission(username, 'super-user')) {
            diet.username = null;
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

        if (!await this.hasPermission(username, 'view-diet')) {
            throw new Error('Unauthorized');
        }

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

        if (!await this.hasPermission(username, 'view-diet')) {
            throw new Error('Unauthorized');
        }

        return this.dietRepository.list(dietGroupId, username);
    }

    public async update(
        applicationId: number,
        diet: Diet,
        username: string,
    ): Promise<Diet> {

        diet.username = username;

        if (!await this.hasPermission(username, 'create-diet')) {
            throw new Error('Unauthorized');
        }

        diet.validate();

        if (!await this.hasPermission(username, 'super-user')) {

            const existingDiet: Diet = await this.dietRepository.find(diet.id);

            if (existingDiet.username === username) {
                throw new Error(`Non super users can only update their own diets`);
            }

            const dietGroup: DietGroup = await this.dietGroupRepository.find(applicationId, diet.group.id);

            if (dietGroup.name !== 'User Defined') {
                throw new Error(`Non super users can only update diets under the 'User Defined' group`);
            }

        } else {
            diet.username = null;
        }

        diet = await this.dietRepository.update(diet);

        if (!await this.hasPermission(username, 'view-diet-values')) {
            diet.removeValues();
        }

        return diet;
    }

}

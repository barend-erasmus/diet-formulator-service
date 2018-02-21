import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { SuggestedValue } from '../entities/suggested-value';
import { IDietRepository } from '../repositories/diet';
import { ISubscriptionRepository } from '../repositories/subscription';
import { ISuggestedValueRepository } from '../repositories/suggested-value';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class SuggestedValueService extends BaseService {

    constructor(
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
        @inject('IDietRepository')
        private dietRepository: IDietRepository,
        @inject('ISuggestedValueRepository')
        private suggestedValueRepository: ISuggestedValueRepository,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async find(dietId: number, ingredientId: number, userName: string): Promise<SuggestedValue> {
        await this.throwIfDoesNotHavePermission(userName, 'view-suggested-value');

        const diet: Diet = await this.dietRepository.find(dietId);

        let dietGroup: DietGroup = diet.group;

        while (dietGroup) {

            const suggestedValue: SuggestedValue = await this.suggestedValueRepository.find(dietGroup.id, ingredientId);

            if (suggestedValue) {
                return this.cleanSuggestedValue(suggestedValue, userName);
            }

            dietGroup = dietGroup.parent;
        }

        return null;
    }

    public async findById(suggestedValueId: number, userName: string): Promise<SuggestedValue> {
        await this.throwIfDoesNotHavePermission(userName, 'view-suggested-value');

        const suggestedValue: SuggestedValue = await this.suggestedValueRepository.findById(suggestedValueId);

        return this.cleanSuggestedValue(suggestedValue, userName);
    }

    public async list(userName: string): Promise<SuggestedValue[]> {
        await this.throwIfDoesNotHavePermission(userName, 'view-suggested-value');

        let result: SuggestedValue[] = await this.suggestedValueRepository.list();

        result = result.sort(this.sortSuggestedValue);

        result = await this.cleanList(result, userName, this.cleanSuggestedValue);

        return result;
    }

    private sortSuggestedValue(a: SuggestedValue, b: SuggestedValue) {
        if (a.ingredient.name < b.ingredient.name) {
            return -1;
        }

        if (a.ingredient.name > b.ingredient.name) {
            return 1;
        }

        return 0;
    }
}

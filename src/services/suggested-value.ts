import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { SuggestedValue } from '../entities/suggested-value';
import { IDietRepository } from '../repositories/diet';
import { ISuggestedValueRepository } from '../repositories/suggested-value';
import { BaseService } from './base';

@injectable()
export class SuggestedValueService extends BaseService {

    constructor(
        @inject('IDietRepository')
        private dietRepository: IDietRepository,
        @inject('ISuggestedValueRepository')
        private suggestedValueRepository: ISuggestedValueRepository,
    ) {
        super();
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

    public async update(
        suggestedValue: SuggestedValue,
        userName: string,
    ): Promise<SuggestedValue> {
        await this.throwIfDoesNotHavePermission(userName, 'update-suggested-value');

        suggestedValue.validate();

        suggestedValue = await this.suggestedValueRepository.update(suggestedValue);

        suggestedValue = await this.cleanSuggestedValue(suggestedValue, userName);

        return suggestedValue;
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

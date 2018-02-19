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
                return suggestedValue;
            }

            dietGroup = dietGroup.parent;
        }

        return null;
    }
}

import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { EventBus } from '../bus/event';
import { Ingredient } from '../entities/ingredient';
import { IngredientEvent } from '../events/ingredient';
import { IngredientCreatedEvent } from '../events/ingredient-created';
import { IIngredientRepository } from '../repositories/ingredient';
import { BaseService } from './base';

@injectable()
export class IngredientService extends BaseService {

    constructor(
        @inject('IIngredientRepository')
        private ingredientRepository: IIngredientRepository,
        @inject('IngredientEventBus')
        private ingredientEventBus: EventBus<IngredientEvent>,
    ) {
        super();
    }

    public async create(
        ingredient: Ingredient,
        userName: string,
    ): Promise<Ingredient> {
        if (!await this.hasPermission(userName, 'create-ingredient')) {
            throw new Error('Unauthorized');
        }

        ingredient.validate();

        const result: Ingredient = await this.ingredientRepository.create(ingredient);

        await this.ingredientEventBus.publish(new IngredientCreatedEvent(userName));

        return result;
    }

    public async list(
        userName: string,
    ): Promise<Ingredient[]> {
        if (!await this.hasPermission(userName, 'view-ingredient')) {
            throw new Error('Unauthorized');
        }

        return this.ingredientRepository.list();
    }
}

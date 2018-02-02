import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { SuggestedValue } from '../../entities/suggested-value';
import { ISuggestedValueRepository } from '../suggested-value';
import { BaseRepository } from './base';

@injectable()
export class SuggestedValueRepository extends BaseRepository implements ISuggestedValueRepository {

    constructor(host: string, userName: string, password: string) {
        super(host, userName, password);
    }

    public async create(suggestedValue: SuggestedValue): Promise<SuggestedValue> {

        const result: any = await BaseRepository.models.SuggestedValue.create({
            description: suggestedValue.description,
            dietGroupId: suggestedValue.dietGroup.id,
            ingredientId: suggestedValue.ingredient.id,
            maximum: suggestedValue.maximum,
            minimum: suggestedValue.minimum,
        });

        suggestedValue.id = result.id;

        return suggestedValue;
    }
}

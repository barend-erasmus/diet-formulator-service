import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { ISuggestedValueRepository } from '../suggested-value';
import { SuggestedValue } from '../../entities/suggested-value';

export class SuggestedValueRepository extends BaseRepository implements ISuggestedValueRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(suggestedValue: SuggestedValue): Promise<SuggestedValue> {

        const result: any = await BaseRepository.models.SuggestedValue.create({
            description: suggestedValue.description,
            maximum: suggestedValue.maximum,
            minimum: suggestedValue.minimum,
            dietGroupId: suggestedValue.dietGroup.id,
            ingredientId: suggestedValue.ingredient.id,
        });

        suggestedValue.id = result.id;

        return suggestedValue;
    }
}

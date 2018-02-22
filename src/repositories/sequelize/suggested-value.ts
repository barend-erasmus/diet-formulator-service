import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { DietGroup } from '../../entities/diet-group';
import { Ingredient } from '../../entities/ingredient';
import { IngredientGroup } from '../../entities/ingredient-group';
import { SuggestedValue } from '../../entities/suggested-value';
import { ICache } from '../../interfaces/cache';
import { ILogger } from '../../interfaces/logger';
import { ISuggestedValueRepository } from '../suggested-value';
import { BaseRepository } from './base';

@injectable()
export class SuggestedValueRepository extends BaseRepository implements ISuggestedValueRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
        logger: ILogger,
        cache: ICache,
    ) {
        super(host, userName, password, logger, cache);
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

    public async find(dietGroupId: number, ingredientId: number): Promise<SuggestedValue> {
        const result: any = await BaseRepository.models.SuggestedValue.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.IngredientGroup,
                        },
                        {
                            include: [
                                {
                                    model: BaseRepository.models.Nutrient,
                                },
                            ],
                            model: BaseRepository.models.IngredientValue,
                        },
                    ],
                    model: BaseRepository.models.Ingredient,
                },
                {
                    model: BaseRepository.models.DietGroup,
                },
            ],
            where: {
                dietGroupId: {
                    [Sequelize.Op.eq]: dietGroupId,
                },
                ingredientId: {
                    [Sequelize.Op.eq]: ingredientId,
                },
            },
        });

        if (!result) {
            return null;
        }

        let dietGroup: DietGroup = new DietGroup(result.dietGroup.id, result.dietGroup.name, result.dietGroup.description, result.dietGroup.dietGroupId ? new DietGroup(result.dietGroup.dietGroupId, null, null, null) : null);

        dietGroup = await this.loadDietGroupParent(dietGroup);

        return this.mapToSuggestedValue(result, dietGroup);
    }

    public async findById(suggestedValueId: number): Promise<SuggestedValue> {
        const result: any = await BaseRepository.models.SuggestedValue.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.IngredientGroup,
                        },
                        {
                            include: [
                                {
                                    model: BaseRepository.models.Nutrient,
                                },
                            ],
                            model: BaseRepository.models.IngredientValue,
                        },
                    ],
                    model: BaseRepository.models.Ingredient,
                },
                {
                    model: BaseRepository.models.DietGroup,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: suggestedValueId,
                },
            },
        });

        if (!result) {
            return null;
        }

        let dietGroup: DietGroup = new DietGroup(result.dietGroup.id, result.dietGroup.name, result.dietGroup.description, result.dietGroup.dietGroupId ? new DietGroup(result.dietGroup.dietGroupId, null, null, null) : null);

        dietGroup = await this.loadDietGroupParent(dietGroup);

        return this.mapToSuggestedValue(result, dietGroup);
    }

    public async list(): Promise<SuggestedValue[]> {
        const result: any[] = await BaseRepository.models.SuggestedValue.findAll({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.IngredientGroup,
                        },
                        {
                            include: [
                                {
                                    model: BaseRepository.models.Nutrient,
                                },
                            ],
                            model: BaseRepository.models.IngredientValue,
                        },
                    ],
                    model: BaseRepository.models.Ingredient,
                },
                {
                    model: BaseRepository.models.DietGroup,
                },
            ],
        });

        const suggestedValues: SuggestedValue[] = [];

        for (const suggestedValue of result) {
            let dietGroup: DietGroup = this.mapToDietGroup(suggestedValue.dietGroup);

            dietGroup = await this.loadDietGroupParent(dietGroup);

            suggestedValues.push(this.mapToSuggestedValue(suggestedValue, dietGroup));
        }

        return suggestedValues;
    }
}

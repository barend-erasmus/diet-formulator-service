import { injectable } from 'inversify';
import 'reflect-metadata';
import * as Sequelize from 'sequelize';
import { DietGroup } from '../../entities/diet-group';
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

    public async find(dietGroupId: number, ingredientId: number): Promise<SuggestedValue> {
        const result: any = await BaseRepository.models.SuggestedValue.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.IngredientGroup,
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

        return new SuggestedValue(result.id, result.description, dietGroup, null, result.minimum, result.maximum);
    }

    public async list(): Promise<SuggestedValue[]> {
        const result: any[] = await BaseRepository.models.SuggestedValue.findAll({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.IngredientGroup,
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
            let dietGroup: DietGroup = new DietGroup(suggestedValue.dietGroup.id, suggestedValue.dietGroup.name, suggestedValue.dietGroup.description, suggestedValue.dietGroup.dietGroupId ? new DietGroup(suggestedValue.dietGroup.dietGroupId, null, null, null) : null);

            dietGroup = await this.loadDietGroupParent(dietGroup);

            suggestedValues.push(new SuggestedValue(suggestedValue.id, suggestedValue.description, dietGroup, null, suggestedValue.minimum, suggestedValue.maximum));
        }

        return suggestedValues;
    }

    private async loadDietGroupParent(dietGroup: DietGroup): Promise<DietGroup> {
        if (dietGroup.parent) {

            const result: any = await BaseRepository.models.DietGroup.find({
                where: {
                    id: {
                        [Sequelize.Op.eq]: dietGroup.parent.id,
                    },
                },
            });

            const parent: DietGroup = new DietGroup(result.id, result.name, result.description, result.dietGroupId ? new DietGroup(result.dietGroupId, null, null, null) : null);

            dietGroup.parent = await this.loadDietGroupParent(parent);
        }

        return dietGroup;
    }
}

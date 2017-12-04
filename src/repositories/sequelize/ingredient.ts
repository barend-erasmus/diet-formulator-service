import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IIngredientRepository } from '../ingredient';
import { Ingredient } from '../../entities/ingredient';

export class IngredientRepository extends BaseRepository implements IIngredientRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(ingredient: Ingredient): Promise<Ingredient> {

        const result: any = await BaseRepository.models.Ingredient.create({
            description: ingredient.description,
            ingredientGroupId: ingredient.group.id,
            ingredientValues: ingredient.values.map((value) => {
                return {
                    nutrientId: value.nutrient.id,
                    value: value.value,
                };
            }),
            name: ingredient.name,
            username: ingredient.username,
        }, {

                include: [
                    {
                        model: BaseRepository.models.IngredientValue,
                    },
                ],
            });

        ingredient.id = result.id;

        return ingredient;
    }
}

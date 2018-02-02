import "reflect-metadata";
import { injectable, inject } from "inversify";
import * as Sequelize from 'sequelize';
import { Ingredient } from '../../entities/ingredient';
import { IngredientGroup } from '../../entities/ingredient-group';
import { IngredientValue } from '../../entities/ingredient-value';
import { Nutrient } from '../../entities/nutrient';
import { IIngredientRepository } from '../ingredient';
import { BaseRepository } from "./base";

@injectable()
export class IngredientRepository extends BaseRepository implements IIngredientRepository {

    constructor(host: string, userName: string, password: string) {
        super(host, userName, password);
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
            userName: ingredient.userName,
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

    public async find(ingredientId: number): Promise<Ingredient> {

        const result: any = await BaseRepository.models.Ingredient.find({
            include: [
                {
                    include: [
                        {
                            model: BaseRepository.models.Nutrient,
                        },
                    ],
                    model: BaseRepository.models.IngredientValue,
                },
                {
                    model: BaseRepository.models.IngredientGroup,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: ingredientId,
                },
            },
        });

        if (!result) {
            return null;
        }

        const ingredientGroup: IngredientGroup = new IngredientGroup(result.ingredientGroup.id, result.ingredientGroup.name, result.ingredientGroup.description);

        return new Ingredient(result.id, result.name, result.description, result.userName, ingredientGroup,
            result.ingredientValues.map((value) =>
                new IngredientValue(value.id, value.value, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder)),
            ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder));
    }

    public async listSupplements(nutrientId: number): Promise<Ingredient[]> {

                const result: any[] = await BaseRepository.models.Supplement.findAll({
                    include: [
                        {
                            include: [
                                {
                                    include: [
                                        {
                                            model: BaseRepository.models.Nutrient,
                                        },
                                    ],
                                    model: BaseRepository.models.IngredientValue,
                                },
                                {
                                    model: BaseRepository.models.IngredientGroup,
                                },
                            ],
                            model: BaseRepository.models.Ingredient,
                        },
                    ],
                    where: {
                        nutrientId: {
                            [Sequelize.Op.eq]: nutrientId,
                        },
                    },
                });

                return result.map((x) => new Ingredient(x.ingredient.id, x.ingredient.name, x.ingredient.description, x.ingredient.userName, new IngredientGroup(x.ingredient.ingredientGroup.id, x.ingredient.ingredientGroup.name, x.ingredient.ingredientGroup.description),
                x.ingredient.ingredientValues.map((value) =>
                    new IngredientValue(value.id, value.value, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder)),
                ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder)));
            }

    public async list(): Promise<Ingredient[]> {

        const result: any[] = await BaseRepository.models.Ingredient.findAll({
            include: [
                {
                    model: BaseRepository.models.IngredientGroup,
                },
            ],
            order: [
                ['name', 'ASC'],
            ],
        });

        return result.map((x) => new Ingredient(x.id, x.name, x.description, x.userName, new IngredientGroup(x.ingredientGroup.id, x.ingredientGroup.name, x.ingredientGroup.description), []));
    }
}

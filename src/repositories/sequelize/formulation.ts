import "reflect-metadata";
import { injectable, inject } from "inversify";
import * as Sequelize from 'sequelize';
import { Diet } from '../../entities/diet';
import { DietGroup } from '../../entities/diet-group';
import { DietValue } from '../../entities/diet-value';
import { Formulation } from '../../entities/formulation';
import { FormulationIngredient } from '../../entities/formulation-ingredient';
import { Ingredient } from '../../entities/ingredient';
import { IngredientGroup } from '../../entities/ingredient-group';
import { IngredientValue } from '../../entities/ingredient-value';
import { Nutrient } from '../../entities/nutrient';
import { SuggestedValue } from '../../entities/suggested-value';
import { IFormulationRepository } from '../formulation';
import { BaseRepository } from "./base";

@injectable()
export class FormulationRepository extends BaseRepository implements IFormulationRepository {

    constructor(host: string, userName: string, password: string) {
        super(host, userName, password);
    }

    public async create(formulation: Formulation, userName: string): Promise<Formulation> {

        const result: any = await BaseRepository.models.Formulation.create({

            cost: formulation.cost,
            dietId: formulation.diet.id,
            feasible: formulation.feasible,
            formulationIngredients: formulation.formulationIngredients.map((formulationIngredient) => {
                return {
                    cost: formulationIngredient.cost,
                    ingredientId: formulationIngredient.ingredient.id,
                    maximum: formulationIngredient.maximum,
                    minimum: formulationIngredient.minimum,
                };
            }),
            mixWeight: formulation.mixWeight,
            name: formulation.name,
            timestamp: formulation.timestamp,
            userName,
        }, {

                include: [
                    {
                        model: BaseRepository.models.FormulationIngredient,
                    },
                ],
            });

        formulation.id = result.id;

        return formulation;
    }

    public async find(formulationId: number): Promise<Formulation> {

        const result: any = await BaseRepository.models.Formulation.find({
            include: [
                {
                    include: [
                        {
                            include: [
                                {
                                    model: BaseRepository.models.Nutrient,
                                },
                            ],
                            model: BaseRepository.models.DietValue,
                        },
                        {
                            model: BaseRepository.models.DietGroup,
                        },
                    ],
                    model: BaseRepository.models.Diet,
                },
                {
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
                    model: BaseRepository.models.FormulationIngredient,
                },
            ],
            where: {
                id: {
                    [Sequelize.Op.eq]: formulationId,
                },
            },
        });

        if (!result) {
            return null;
        }

        let dietGroup: DietGroup = new DietGroup(result.diet.dietGroup.id, result.diet.dietGroup.name, result.diet.dietGroup.description, result.diet.dietGroup.dietGroupId ? new DietGroup(result.diet.dietGroup.dietGroupId, null, null, null) : null);

        dietGroup = await this.loadDietGroupParent(dietGroup);

        const diet: Diet = new Diet(result.diet.id, result.diet.name, result.diet.description, result.diet.userName, dietGroup,
            result.diet.dietValues.map((value) =>
                new DietValue(value.id, value.minimum, value.maximum, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder)),
            ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder));

        const formulation: Formulation = new Formulation(result.id, result.name, diet, result.formulationIngredients.map((formulationIngredient) => new FormulationIngredient(
            formulationIngredient.id,
            new Ingredient(formulationIngredient.ingredient.id,
                formulationIngredient.ingredient.name,
                formulationIngredient.ingredient.description,
                formulationIngredient.ingredient.userName,
                new IngredientGroup(formulationIngredient.ingredient.ingredientGroup.id, formulationIngredient.ingredient.ingredientGroup.name, formulationIngredient.ingredient.ingredientGroup.description),
                formulationIngredient.ingredient.ingredientValues.map((value) =>
                    new IngredientValue(value.id, value.value, new Nutrient(value.nutrient.id, value.nutrient.nam, value.nutrient.des, value.nutrient.cod, value.nutrient.abb, value.nutrient.uni, value.nutrient.sor)),
                ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder)),
            formulationIngredient.cost,
            formulationIngredient.minimum,
            formulationIngredient.maximum,
            formulationIngredient.weight,
        )), result.cost, result.feasible, result.mixWeight, new Date());

        return formulation;
    }

    public async list(userName: string): Promise<Formulation[]> {
        const result: any[] = await BaseRepository.models.Formulation.findAll({
            order: [
                ['timestamp', 'DESC'],
            ],
            where: {
                userName: {
                    [Sequelize.Op.eq]: userName,
                },
            },
        });

        return result.map((x) => new Formulation(x.id, x.name, null, [], x.cost, x.feasible, x.mixWeight, x.timestamp));
    }

    public async findSuggestedValue(dietGroupId: number, ingredientId: number): Promise<SuggestedValue> {
        const result: any = await BaseRepository.models.SuggestedValue.find({
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

        return new SuggestedValue(result.id, result.description, null, null, result.minimum, result.maximum);
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

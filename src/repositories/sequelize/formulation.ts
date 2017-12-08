import * as Sequelize from 'sequelize';
import { BaseRepository } from "./base";
import { IFormulationRepository } from '../formulation';
import { Formulation } from '../../entities/formulation';
import { DietGroup } from '../../entities/diet-group';
import { DietValue } from '../../entities/diet-value';
import { Diet } from '../../entities/diet';
import { Nutrient } from '../../entities/nutrient';
import { FormulationIngredient } from '../../entities/formulation-ingredient';
import { Ingredient } from '../../entities/ingredient';
import { IngredientValue } from '../../entities/ingredient-value';
import { IngredientGroup } from '../../entities/ingredient-group';

export class FormulationRepository extends BaseRepository implements IFormulationRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(formulation: Formulation, username: string): Promise<Formulation> {

        const result: any = await BaseRepository.models.Formulation.create({
            name: formulation.name,
            username,
            dietId: formulation.diet.id,
            formulationIngredients: formulation.formulationIngredients.map((formulationIngredient) => {
                return {
                    cost: formulationIngredient.cost,
                    maximum: formulationIngredient.maximum,
                    minimum: formulationIngredient.minimum,
                    ingredientId: formulationIngredient.ingredient.id,
                };
            }),
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

        const diet: Diet = new Diet(result.diet.id, result.diet.name, result.diet.description, result.diet.username, dietGroup,
            result.diet.dietValues.map((value) =>
                new DietValue(value.id, value.minimum, value.maximum, new Nutrient(value.nutrient.id, value.nutrient.name, value.nutrient.description, value.nutrient.code, value.nutrient.abbreviation, value.nutrient.unit, value.nutrient.sortOrder)),
            ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder));
            
        return new Formulation(result.id, result.name, diet, result.formulationIngredients.map((formulationIngredient) => new FormulationIngredient(
            formulationIngredient.id,
            new Ingredient(formulationIngredient.ingredient.id,
                formulationIngredient.ingredient.name,
                formulationIngredient.ingredient.description,
                formulationIngredient.ingredient.username,
                new IngredientGroup(formulationIngredient.ingredient.ingredientGroup.id, formulationIngredient.ingredient.ingredientGroup.name, formulationIngredient.ingredient.ingredientGroup.description),
                formulationIngredient.ingredient.ingredientValues.map((value) =>
                    new IngredientValue(value.id, value.value, new Nutrient(value.nutrient.id, value.nutrient.nam, value.nutrient.des, value.nutrient.cod, value.nutrient.abb, value.nutrient.uni, value.nutrient.sor)),
                ).sort((a, b) => a.nutrient.sortOrder - b.nutrient.sortOrder)),
            formulationIngredient.cost,
            formulationIngredient.minimum,
            formulationIngredient.maximum,
            formulationIngredient.weight,
        )), result.cost, result.feasible);
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
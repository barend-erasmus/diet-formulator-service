import * as solver from 'javascript-lp-solver';
import * as moment from 'moment';
import { Diet } from "../entities/diet";
import { DietValue } from '../entities/diet-value';
import { Formulation } from '../entities/formulation';
import { FormulationCompositionValue } from '../entities/formulation-composition-value';
import { FormulationIngredient } from "../entities/formulation-ingredient";
import { IDietRepository } from '../repositories/diet';
import { IIngredientRepository } from '../repositories/ingredient';
import { IFormulationRepository } from '../repositories/formulation';
import { BaseService } from './base';
import { IUserRepository } from '../repositories/user';

export class FormulatorService extends BaseService {

    constructor(
        userRepository: IUserRepository,
        private dietRepository: IDietRepository,
        private ingredientRepository: IIngredientRepository,
        private formulationRepository: IFormulationRepository,
    ) {
        super(userRepository);
    }

    public async createFormulation(diet: Diet, formulationIngredients: FormulationIngredient[], mixWeight: number, username: string): Promise<Formulation> {

        if (!await this.hasPermission(username, 'create-formulation')) {
            throw new Error('Unauthorized');
        }

        diet = await this.dietRepository.find(diet.id);

        for (const formulationIngredient of formulationIngredients) {
            if (formulationIngredient.ingredient.username && formulationIngredient.ingredient.username !== username) {
                throw new Error(`Cannot use other user's ingredients`);
            }

            formulationIngredient.ingredient = await this.ingredientRepository.find(formulationIngredient.ingredient.id);
        }

        const groupChart: string[] = [];

        let group: any = diet.group;

        while (group) {
            groupChart.push(group.name);

            group = group.parent;
        }

        groupChart.reverse();

        const formulation: Formulation = new Formulation(null, `${groupChart.join(' - ')} - ${diet.name} - ${moment().format('DD-MM-YYYY')}`, diet, formulationIngredients, null, null);

        let result: Formulation = await this.formulate(formulation, mixWeight, username);

        result = await this.formulationRepository.create(formulation, username);

        if (!this.hasPermission(username, 'view-formulation-values')) {
            result.removeValues();
        }

        return result;
    }

    public async find(formulationId: number, username: string): Promise<Formulation> {

        if (!await this.hasPermission(username, 'view-formulation')) {
            throw new Error('Unauthorized');
        }

        let formulation: Formulation = await this.formulationRepository.find(formulationId);

        formulation = await this.formulate(formulation, 1000, username);

        if (!this.hasPermission(username, 'view-formulation-values')) {
            formulation.removeValues();
        }

        return formulation;
    }

    public async composition(formulationId: number, username: string): Promise<FormulationCompositionValue[]> {

        if (!await this.hasPermission(username, 'view-formulation-composition')) {
            throw new Error('Unauthorized');
        }

        let formulation: Formulation = await this.formulationRepository.find(formulationId);

        formulation = await this.formulate(formulation, 1000, username);

        const comparisonDiet: Diet = await this.dietRepository.findComparison(formulation.diet.id);

        return this.calculateFormulationComposition(formulation, comparisonDiet, 1000);
    }


    public async formulate(formulation: Formulation, mixWeight: number, username: string): Promise<Formulation> {

        let results: any;

        const model = {
            constraints: this.buildConstraintsForSolver(formulation.formulationIngredients, formulation.diet, mixWeight),
            opType: "min",
            optimize: "cost",
            variables: this.buildVariablesForSolver(formulation.formulationIngredients),
        };

        results = solver.Solve(model);

        for (const formulationIngredient of formulation.formulationIngredients) {
            formulationIngredient.weight = results[`ingredient-${formulationIngredient.ingredient.id}`] === undefined ? 0 : results[`ingredient-${formulationIngredient.ingredient.id}`];
        }

        formulation.cost = results.result / mixWeight;
        formulation.feasible = results.feasible;

        return formulation;
    }

    public async calculateFormulationComposition(formulation: Formulation, comparisonDiet: Diet, mixWeight): Promise<FormulationCompositionValue[]> {

        const result: FormulationCompositionValue[] = [];

        if (!comparisonDiet) {
            comparisonDiet = formulation.diet;
        }

        for (const value of comparisonDiet.values) {
            const sum = formulation.formulationIngredients.map((formulationIngredient) => {
                return formulationIngredient.ingredient.values.find((x) => x.nutrient.id === value.nutrient.id) ? formulationIngredient.ingredient.values.find((x) => x.nutrient.id === value.nutrient.id).value * formulationIngredient.weight : 0;
            }).reduce((a, b) => a + b) / mixWeight;

            let comparisonDietValue: DietValue = comparisonDiet.values.find((x) => x.nutrient.id === value.nutrient.id);

            let status: string = `Adequate`;

            if (comparisonDietValue.minimum && ((sum - comparisonDietValue.minimum) / comparisonDietValue.minimum < -0.01)) {
                status = `Inadequate`;
            }

            if (comparisonDietValue.maximum && ((sum - comparisonDietValue.maximum) / comparisonDietValue.maximum > 0.01)) {
                status = `Excessive`;
            }

            result.push(new FormulationCompositionValue(sum, value.nutrient, status));
        }

        return result;
    }

    private buildConstraintsForSolver(formulationIngredients: FormulationIngredient[], diet: Diet, mixWeight: number) {
        const constraints = {
            weight: null,
        };

        for (const value of diet.values) {
            constraints[`nutrient-${value.nutrient.id}`] = {
                max: value.maximum == null ? 100000000 : value.maximum * mixWeight,
                min: value.minimum * mixWeight,
            };
        }

        for (const formulationIngredient of formulationIngredients) {
            constraints[`ingredient-${formulationIngredient.ingredient.id}`] = {
                max: formulationIngredient.maximum,
                min: formulationIngredient.minimum,
            };
        }

        constraints.weight = {
            max: mixWeight,
            min: mixWeight,
        };

        return constraints;
    }

    private buildVariablesForSolver(formulationIngredients: FormulationIngredient[]) {
        const variables = {};

        for (const formulationIngredient of formulationIngredients) {
            const t = {
                cost: formulationIngredient.cost,
                weight: 1,
            };

            for (const value of formulationIngredient.ingredient.values) {
                t[`nutrient-${value.nutrient.id}`] = value.value;
            }

            t[`ingredient-${formulationIngredient.ingredient.id}`] = 1;

            variables[`ingredient-${formulationIngredient.ingredient.id}`] = t;
        }

        return variables;
    }
}

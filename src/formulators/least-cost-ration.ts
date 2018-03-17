import { injectable } from 'inversify';
import * as solver from 'javascript-lp-solver';
import 'reflect-metadata';

import { Diet } from '../entities/diet';
import { Formulation } from '../entities/formulation';
import { FormulationIngredient } from '../entities/formulation-ingredient';
import { IFormulator } from '../interfaces/formulator';

@injectable()
export class LeastCostRationFormulator implements IFormulator {

    public async formulate(formulation: Formulation): Promise<Formulation> {
        let results: any;

        const model = {
            constraints: this.buildConstraintsForSolver(formulation.formulationIngredients, formulation.diet, formulation.mixWeight),
            opType: 'min',
            optimize: 'cost',
            variables: this.buildVariablesForSolver(formulation.formulationIngredients),
        };

        results = solver.Solve(model);

        for (const formulationIngredient of formulation.formulationIngredients) {
            formulationIngredient.weight = results[`ingredient-${formulationIngredient.ingredient.id}`] === undefined ? 0 : results[`ingredient-${formulationIngredient.ingredient.id}`];
        }

        formulation.cost = results.result / formulation.mixWeight;
        formulation.feasible = results.feasible;

        formulation.formulationIngredients = formulation.formulationIngredients.sort((a: FormulationIngredient, b: FormulationIngredient) => a.weight > b.weight ? -1 : (a.weight < b.weight ? 1 : 0));

        return formulation;
    }

    private buildConstraintsForSolver(formulationIngredients: FormulationIngredient[], diet: Diet, mixWeight: number) {
        const constraints = {
            weight: null,
        };

        for (const value of diet.values) {
            constraints[`nutrient-${value.nutrient.id}`] = {
                max: value.maximum === null ? 100000000 : value.maximum * mixWeight,
                min: value.minimum == null ? 0 : value.minimum * mixWeight,
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

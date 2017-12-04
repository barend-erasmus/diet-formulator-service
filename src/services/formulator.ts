import * as solver from 'javascript-lp-solver';
import { Diet } from "../entities/diet";
import { Formulation } from '../entities/formulation';
import { FormulationIngredient } from "../entities/formulation-ingredient";

export class FormulatorService {

    public async formulate(formulation: Formulation, username: string, resultWeight: number): Promise<Formulation> {

        let results: any;

        const model = {
            constraints: this.buildConstraintsForSolver(formulation.formulationIngredients, formulation.diet, resultWeight),
            opType: "min",
            optimize: "cost",
            variables: this.buildVariablesForSolver(formulation.formulationIngredients),
        };

        results = solver.Solve(model);

        console.log(model);

        for (const formulationIngredient of formulation.formulationIngredients) {
            formulationIngredient.weight = results[formulationIngredient.id] === undefined ? 0 : results[formulationIngredient.id];
        }

        formulation.cost = results.result / resultWeight;
        formulation.feasible = results.feasible;

        return formulation;
    }

    private buildConstraintsForSolver(formulationIngredients: FormulationIngredient[], diet: Diet, resultWeight: number) {
        const constraints = {
            weight: null,
        };

        for (const value of diet.values) {
            constraints[value.id] = {
                max: value.maximum == null ? Number.MAX_SAFE_INTEGER : value.maximum * resultWeight,
                min: value.minimum * resultWeight,
            };
        }

        for (const formulationIngredient of formulationIngredients) {
            constraints[formulationIngredient.id] = {
                max: formulationIngredient.maximum,
                min: formulationIngredient.minimum,
            };
        }

        constraints.weight = {
            max: resultWeight,
            min: resultWeight,
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

            for (const ingredientValue of formulationIngredient.values) {
                t[ingredientValue.nutrient.id] = ingredientValue.nutrient;
            }

            t[formulationIngredient.id] = 1;

            variables[formulationIngredient.id] = t;
        }

        return variables;
    }
}

import * as solver from 'javascript-lp-solver';
import { Diet } from "../entities/diet";
import { Formulation } from '../entities/formulation';
import { FormulationIngredient } from "../entities/formulation-ingredient";
import { FormulationCompositionValue } from '../entities/formulation-composition-value';

export class FormulatorService {

    public async formulate(formulation: Formulation, username: string, mixWeight: number): Promise<Formulation> {

        let results: any;

        const model = {
            constraints: this.buildConstraintsForSolver(formulation.formulationIngredients, formulation.diet, mixWeight),
            opType: "min",
            optimize: "cost",
            variables: this.buildVariablesForSolver(formulation.formulationIngredients),
        };

        results = solver.Solve(model);

        for (const formulationIngredient of formulation.formulationIngredients) {
            formulationIngredient.weight = results[`ingredient-${formulationIngredient.id}`] === undefined ? 0 : results[`ingredient-${formulationIngredient.id}`];
        }

        formulation.cost = results.result / mixWeight;
        formulation.feasible = results.feasible;

        return formulation;
    }

    public async calculateFormulationComposition(formulation: Formulation): Promise<FormulationCompositionValue[]> {

        const result: FormulationCompositionValue[] = [];
        
        formulation.diet.values.map((value) => {
            return 
        });

        for (const value of formulation.diet.values) {
            const sum = formulation.formulationIngredients.map((ingredient) => {
               return ingredient.values.find((x) => x.nutrient.id === value.nutrient.id)? ingredient.values.find((x) => x.nutrient.id === value.nutrient.id).value * ingredient.weight : 0; 
            }).reduce((a, b) => a + b);

            result.push(new FormulationCompositionValue(sum, value.nutrient, null));
        }

        return result;
    }

    private buildConstraintsForSolver(formulationIngredients: FormulationIngredient[], diet: Diet, mixWeight: number, ) {
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
            constraints[`ingredient-${formulationIngredient.id}`] = {
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

            for (const value of formulationIngredient.values) {
                t[`nutrient-${value.nutrient.id}`] = value.value;
            }

            t[`ingredient-${formulationIngredient.id}`] = 1;

            variables[`ingredient-${formulationIngredient.id}`] = t;
        }

        return variables;
    }
}

import { expect } from 'chai';
import 'mocha';
import { FormulatorService } from './formulator';
import { Formulation } from '../entities/formulation';
import { Diet } from '../entities/diet';
import { DietValue } from '../entities/diet-value';
import { Nutrient } from '../entities/nutrient';
import { FormulationIngredient } from '../entities/formulation-ingredient';
import { IngredientValue } from '../entities/ingredient-value';

describe('FormulatorService', () => {
    describe('formulate', () => {
        it('should return feasible formulation', async () => {
            const formulatorService: FormulatorService = new FormulatorService();

            const diet: Diet = new Diet(null, null, null, null, null, [
                new DietValue(1, 0, 100, new Nutrient(1, 'Nutrient A', null, null, null, null, null)),
                new DietValue(2, 0, 100, new Nutrient(2, 'Nutrient B', null, null, null, null, null)),
                new DietValue(3, 0, 100, new Nutrient(3, 'Nutrient C', null, null, null, null, null)),
            ]);

            const formulation: Formulation = new Formulation(null, diet, [
                new FormulationIngredient(1, 'Ingredient 1', null, null, null, [
                    new IngredientValue(1, 10, new Nutrient(1, 'Nutrient A', null, null, null, null, null)),
                    new IngredientValue(2, 15, new Nutrient(2, 'Nutrient B', null, null, null, null, null)),
                    new IngredientValue(3, 30, new Nutrient(3, 'Nutrient C', null, null, null, null, null)),
                ], 200, 200, 750, null),
                new FormulationIngredient(2, 'Ingredient 2', null, null, null, [
                    new IngredientValue(1, 50, new Nutrient(1, 'Nutrient A', null, null, null, null, null)),
                    new IngredientValue(2, 70, new Nutrient(2, 'Nutrient B', null, null, null, null, null)),
                    new IngredientValue(3, 10, new Nutrient(3, 'Nutrient C', null, null, null, null, null)),
                ], 100, 50, 750, null),
                new FormulationIngredient(3, 'Ingredient 3', null, null, null, [
                    new IngredientValue(1, 5, new Nutrient(1, 'Nutrient A', null, null, null, null, null)),
                    new IngredientValue(2, 2, new Nutrient(2, 'Nutrient B', null, null, null, null, null)),
                    new IngredientValue(3, 7, new Nutrient(3, 'Nutrient C', null, null, null, null, null)),
                ], 75, 50, 750, null),
                new FormulationIngredient(4, 'Ingredient 4', null, null, null, [
                    new IngredientValue(1, 20, new Nutrient(1, 'Nutrient A', null, null, null, null, null)),
                    new IngredientValue(2, 30, new Nutrient(2, 'Nutrient B', null, null, null, null, null)),
                    new IngredientValue(3, 5, new Nutrient(3, 'Nutrient C', null, null, null, null, null)),
                ], 70, 0, 350, null),
            ], null, null);

            const result: Formulation = await formulatorService.formulate(formulation, null, 750);

            expect(result.feasible).to.be.true;
            expect(Math.round(result.cost * 100) / 100).to.eq(107.67);
        });
    });
});
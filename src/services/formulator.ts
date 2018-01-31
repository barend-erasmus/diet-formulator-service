import * as moment from 'moment';
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Diet } from "../entities/diet";
import { DietGroup } from '../entities/diet-group';
import { DietValue } from '../entities/diet-value';
import { Formulation } from '../entities/formulation';
import { FormulationCompositionValue } from '../entities/formulation-composition-value';
import { FormulationIngredient } from "../entities/formulation-ingredient";
import { Ingredient } from '../entities/ingredient';
import { SuggestedValue } from '../entities/suggested-value';
import { Supplement } from '../entities/supplement';
import { SupplementIngredient } from '../entities/supplement-ingredient';
import { IDietRepository } from '../repositories/diet';
import { IFormulationRepository } from '../repositories/formulation';
import { IIngredientRepository } from '../repositories/ingredient';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';
import { IFormulator } from '../interfaces/formulator';

export class FormulatorService extends BaseService {

    constructor(
        @inject("IUserRepository")
        userRepository: IUserRepository,
        @inject("IDietRepository")
        private dietRepository: IDietRepository,
        @inject("IIngredientRepository")
        private ingredientRepository: IIngredientRepository,
        @inject("IFormulationRepository")
        private formulationRepository: IFormulationRepository,
        @inject("IFormulator")
        private formulator: IFormulator,
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

        const formulation: Formulation = new Formulation(null, `${groupChart.join(' - ')} - ${diet.name} - ${moment().format('DD-MM-YYYY')}`, diet, formulationIngredients, null, null, mixWeight, new Date());

        let result: Formulation = await this.formulator.formulate(formulation);

        result = await this.formulationRepository.create(formulation, username);

        if (!await this.hasPermission(username, 'view-formulation-values')) {
            result.removeValues();
        }

        return result;
    }

    public async find(formulationId: number, username: string): Promise<Formulation> {

        if (!await this.hasPermission(username, 'view-formulation')) {
            throw new Error('Unauthorized');
        }

        let formulation: Formulation = await this.formulationRepository.find(formulationId);

        formulation = await this.formulator.formulate(formulation);

        if (!await this.hasPermission(username, 'view-formulation-values')) {
            formulation.removeValues();
        }

        return formulation;
    }

    public async suggestedValue(dietId: number, ingredientId: number, username: string): Promise<SuggestedValue> {

        if (!await this.hasPermission(username, 'view-suggested-value')) {
            throw new Error('Unauthorized');
        }

        const diet: Diet = await this.dietRepository.find(dietId);

        let dietGroup: DietGroup = diet.group;

        while (dietGroup) {

            const suggestedValue: SuggestedValue = await this.formulationRepository.findSuggestedValue(dietGroup.id, ingredientId);

            if (suggestedValue) {
                return suggestedValue;
            }

            dietGroup = dietGroup.parent;
        }

        return null;
    }

    public async list(username: string): Promise<Formulation[]> {

        if (!await this.hasPermission(username, 'view-formulation')) {
            throw new Error('Unauthorized');
        }

        const formulations: Formulation[] = await this.formulationRepository.list(username);

        return formulations;
    }

    public async composition(formulationId: number, username: string): Promise<FormulationCompositionValue[]> {

        if (!await this.hasPermission(username, 'view-formulation-composition')) {
            throw new Error('Unauthorized');
        }

        let formulation: Formulation = await this.formulationRepository.find(formulationId);

        formulation = await this.formulator.formulate(formulation);

        const comparisonDiet: Diet = await this.dietRepository.findComparison(formulation.diet.id);

        return this.calculateFormulationComposition(formulation, comparisonDiet);
    }

    public async supplement(formulationId: number, username: string): Promise<Supplement[]> {

        if (!await this.hasPermission(username, 'view-formulation-supplement')) {
            throw new Error('Unauthorized');
        }

        let formulation: Formulation = await this.formulationRepository.find(formulationId);

        formulation = await this.formulator.formulate(formulation);

        const comparisonDiet: Diet = await this.dietRepository.findComparison(formulation.diet.id);

        const FormulationCompositionValues: FormulationCompositionValue[] = await this.calculateFormulationComposition(formulation, comparisonDiet);

        if (!comparisonDiet) {
            throw new Error('Diet does not have a comparison diet');
        }

        const result: Supplement[] = [];

        for (const value of comparisonDiet.values) {
            const sum = formulation.formulationIngredients.map((formulationIngredient) => {
                return formulationIngredient.ingredient.values.find((x) => x.nutrient.id === value.nutrient.id) ? formulationIngredient.ingredient.values.find((x) => x.nutrient.id === value.nutrient.id).value * formulationIngredient.weight : 0;
            }).reduce((a, b) => a + b) / formulation.mixWeight;

            const comparisonDietValue: DietValue = comparisonDiet.values.find((x) => x.nutrient.id === value.nutrient.id);

            if (comparisonDietValue.minimum && ((sum - comparisonDietValue.minimum) / comparisonDietValue.minimum < -0.01)) {
                const valueRequired: number = comparisonDietValue.minimum - sum;

                const ingredients: Ingredient[] = await this.ingredientRepository.listSupplements(value.nutrient.id);

                result.push(new Supplement(value.nutrient, ingredients.map((x) => new SupplementIngredient(x, valueRequired / x.values.find((y) => y.nutrient.id === value.nutrient.id).value * formulation.mixWeight))));
            }
        }

        if (!await this.hasPermission(username, 'view-formulation-supplement-values')) {

            for (const supplement of result) {
                supplement.removeValues();
            }
        }

        return result;
    }

    public async calculateFormulationComposition(formulation: Formulation, comparisonDiet: Diet): Promise<FormulationCompositionValue[]> {

        const result: FormulationCompositionValue[] = [];

        if (!comparisonDiet) {
            comparisonDiet = formulation.diet;
        }

        for (const value of comparisonDiet.values) {
            const sum = formulation.formulationIngredients.map((formulationIngredient) => {
                return formulationIngredient.ingredient.values.find((x) => x.nutrient.id === value.nutrient.id) ? formulationIngredient.ingredient.values.find((x) => x.nutrient.id === value.nutrient.id).value * formulationIngredient.weight : 0;
            }).reduce((a, b) => a + b) / formulation.mixWeight;

            const comparisonDietValue: DietValue = comparisonDiet.values.find((x) => x.nutrient.id === value.nutrient.id);

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
}

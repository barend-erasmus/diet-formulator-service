import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { Diet } from '../entities/diet';
import { DietGroup } from '../entities/diet-group';
import { DietValue } from '../entities/diet-value';
import { Formulation } from '../entities/formulation';
import { FormulationCompositionValue } from '../entities/formulation-composition-value';
import { FormulationIngredient } from '../entities/formulation-ingredient';
import { Ingredient } from '../entities/ingredient';
import { SuggestedValue } from '../entities/suggested-value';
import { Supplement } from '../entities/supplement';
import { SupplementIngredient } from '../entities/supplement-ingredient';
import { WorldOfRationsError } from '../errors/world-of-rations-error';
import { ICache } from '../interfaces/cache';
import { IFormulator } from '../interfaces/formulator';
import { IDietRepository } from '../repositories/diet';
import { IFormulationRepository } from '../repositories/formulation';
import { IIngredientRepository } from '../repositories/ingredient';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class FormulationService extends BaseService {

    constructor(
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
        @inject('IDietRepository')
        private dietRepository: IDietRepository,
        @inject('IIngredientRepository')
        private ingredientRepository: IIngredientRepository,
        @inject('IFormulationRepository')
        private formulationRepository: IFormulationRepository,
        @inject('IFormulator')
        private formulator: IFormulator,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async create(diet: Diet, formulationIngredients: FormulationIngredient[], mixWeight: number, userName: string): Promise<Formulation> {

        await this.throwIfDoesNotHavePermission(userName, 'create-formulation');

        diet = await this.dietRepository.find(diet.id);

        for (const formulationIngredient of formulationIngredients) {
            await this.loadIngredientForFormulationIngredient(formulationIngredient, userName);
        }

        const groupChart: string = this.buildGroupChart(diet.group);

        const formulation: Formulation = new Formulation(null, `${groupChart} - ${diet.name} - ${moment().format('DD-MM-YYYY')}`, diet, formulationIngredients, null, null, mixWeight, new Date());

        let result: Formulation = await this.formulator.formulate(formulation);

        result = await this.formulationRepository.create(formulation, userName);

        result = await this.removeFormulationValuesIfNotHaveViewFormulationValuesPermission(userName, result);

        return result;
    }

    public async find(formulationId: number, userName: string): Promise<Formulation> {

        await this.throwIfDoesNotHavePermission(userName, 'view-formulation');

        const formulation: Formulation = await this.findFormulatedFormulation(formulationId, userName);

        this.removeFormulationValuesIfNotHaveViewFormulationValuesPermission(userName, formulation);

        return formulation;
    }

    public async list(userName: string): Promise<Formulation[]> {

        await this.throwIfDoesNotHavePermission(userName, 'view-formulation');

        const formulations: Formulation[] = await this.formulationRepository.list(userName);

        return formulations;
    }

    public async composition(formulationId: number, userName: string): Promise<FormulationCompositionValue[]> {

        await this.throwIfDoesNotHavePermission(userName, 'view-formulation-composition');

        const formulation: Formulation = await this.findFormulatedFormulation(formulationId, userName);

        const comparisonDiet: Diet = await this.dietRepository.findComparison(formulation.diet.id);

        return this.calculateFormulationComposition(formulation, comparisonDiet);
    }

    public async supplement(formulationId: number, userName: string): Promise<Supplement[]> {

        await this.throwIfDoesNotHavePermission(userName, 'view-formulation-supplement');

        const formulation: Formulation = await this.findFormulatedFormulation(formulationId, userName);

        const comparisonDiet: Diet = await this.dietRepository.findComparison(formulation.diet.id);

        this.throwIfComparisonDietNull(comparisonDiet);

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

        if (!await this.hasPermission(userName, 'view-formulation-supplement-values')) {
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

    private buildGroupChart(dietGroup: DietGroup): string {
        const groupChart: string[] = [];

        while (dietGroup) {
            groupChart.push(dietGroup.name);

            dietGroup = dietGroup.parent;
        }

        groupChart.reverse();

        return groupChart.join(' - ');
    }

    private async findFormulatedFormulation(formulationId: number, userName: string): Promise<Formulation> {

        let formulation: Formulation = await this.formulationRepository.find(formulationId);

        formulation = await this.formulator.formulate(formulation);

        return formulation;
    }

    private async loadIngredientForFormulationIngredient(formulationIngredient: FormulationIngredient, userName: string): Promise<FormulationIngredient> {
        if (formulationIngredient.ingredient.userName && formulationIngredient.ingredient.userName !== userName) {
            throw new WorldOfRationsError('mismatched_userName', `Cannot use other user's ingredients in your formulation`);
        }

        formulationIngredient.ingredient = await this.ingredientRepository.find(formulationIngredient.ingredient.id);

        return formulationIngredient;
    }

    private async removeFormulationValuesIfNotHaveViewFormulationValuesPermission(userName: string, formulation: Formulation): Promise<Formulation> {
        if (!await this.hasPermission(userName, 'view-formulation-values')) {
            formulation.removeValues();
        }

        return formulation;
    }

    private throwIfComparisonDietNull(comparisonDiet: Diet): void {
        if (!comparisonDiet) {
            throw new WorldOfRationsError('no_comparison_diet', 'Diet does not have a comparison diet');
        }
    }
}

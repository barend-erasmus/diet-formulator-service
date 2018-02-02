import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { FormulationService } from './formulation';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { IUserRepository } from '../repositories/user';
import { IDietRepository } from '../repositories/diet';
import { Formulation } from '../entities/formulation';
import { Diet } from '../entities/diet';
import { FormulationIngredient } from '../entities/formulation-ingredient';
import { IIngredientGroupRepository } from '../repositories/ingredient-group';
import { IFormulationRepository } from '../repositories/formulation';
import { IFormulator } from '../interfaces/formulator';
import { IIngredientRepository } from '../repositories/ingredient';
import { SubscriptionFactory } from '../factories/subscription';
import { SuperAdminSubscription } from '../subscriptions/super-admin';
import { User } from '../entities/user';
import { DietRepository } from '../repositories/sequelize/diet';
import { config } from '../config';
import { IngredientRepository } from '../repositories/sequelize/ingredient';
import { LeastCostRationFormulator } from '../formulators/least-cost-ration';
import { Ingredient } from '../entities/ingredient';
import { DietGroup } from '../entities/diet-group';
import { IBaseRepository } from '../repositories/base';
import { BaseRepository } from '../repositories/sequelize/base';

describe('FormulationService - Integration', () => {
    describe('create', () => {

        let baseRepository: IBaseRepository = null;

        let subscriptionFactory: ISubscriptionFactory = null;

        let userRepository: IUserRepository = null;

        let dietRepository: IDietRepository = null;

        let ingredientRepository: IIngredientRepository = null;

        let formulationRepository: IFormulationRepository = null;

        let formulator: IFormulator = null;

        let formulationService: FormulationService = null;

        beforeEach(async () => {

            baseRepository = new BaseRepository(config.database.host, config.database.userName, config.database.password);

            subscriptionFactory = <SubscriptionFactory>{
                create: (type: string, isSuperAdmin: boolean) => null,
            };
            sinon.stub(subscriptionFactory, 'create').returns(new SuperAdminSubscription([]));

            userRepository = <IUserRepository>{
                findByUsername: (userName: string) => null,
            };
            sinon.stub(userRepository, 'findByUsername').returns(new User(null, null, null, null, null, null, null, null, null));

            dietRepository = new DietRepository(config.database.host, config.database.userName, config.database.password);

            ingredientRepository = new IngredientRepository(config.database.host, config.database.userName, config.database.password);

            formulationRepository = <IFormulationRepository>{
                create: (formulation: Formulation, userName: string) => null,
            };
            sinon.stub(formulationRepository, 'create').callsFake((formulation: Formulation, userName: string) => {
                return formulation;
            });

            formulator = new LeastCostRationFormulator();

            formulationService = new FormulationService(subscriptionFactory, userRepository, dietRepository, ingredientRepository, formulationRepository, formulator);

        });

        it('should return feasible formulation', async () => {

            try {
                const formulation: Formulation = new Formulation(
                    null,
                    null,
                    new Diet(371, null, null, null, new DietGroup(148, 'Micronutrients excluded', null, new DietGroup(147, 'Calf Grower and Heifer Replacement rations', null, new DietGroup(83, 'Dairy Cattle', null, null))), null),
                    [
                        new FormulationIngredient(2, new Ingredient(2, null, null, null, null, null), 2300, 0, 1000, null),
                        new FormulationIngredient(204, new Ingredient(204, null, null, null, null, null), 800, 0, 1000, null),
                        new FormulationIngredient(72, new Ingredient(72, null, null, null, null, null), 3800, 0, 1000, null),
                        new FormulationIngredient(161, new Ingredient(161, null, null, null, null, null), 3000, 0, 1000, null),
                        new FormulationIngredient(151, new Ingredient(151, null, null, null, null, null), 4500, 0, 80, null),
                        new FormulationIngredient(104, new Ingredient(104, null, null, null, null, null), 6000, 0, 1000, null),
                        new FormulationIngredient(83, new Ingredient(83, null, null, null, null, null), 7000, 0, 120, null),
                        new FormulationIngredient(226, new Ingredient(226, null, null, null, null, null), 6000, 0, 4, null),
                        new FormulationIngredient(49, new Ingredient(49, null, null, null, null, null), 7500, 0, 1000, null),
                        new FormulationIngredient(47, new Ingredient(47, null, null, null, null, null), 1200, 0, 1000, null),
                        new FormulationIngredient(153, new Ingredient(153, null, null, null, null, null), 900, 4, 4, null),
                        new FormulationIngredient(119, new Ingredient(119, null, null, null, null, null), 2000, 0, 1000, null),
                        new FormulationIngredient(138, new Ingredient(138, null, null, null, null, null), 2500, 0, 1000, null),
                        new FormulationIngredient(42, new Ingredient(42, null, null, null, null, null), 2500, 0, 1000, null),
                        new FormulationIngredient(181, new Ingredient(181, null, null, null, null, null), 5000, 0, 1000, null),
                    ],
                    null,
                    null,
                    1000,
                    null,
                );

                const result: Formulation = await formulationService.create(formulation.diet, formulation.formulationIngredients, formulation.mixWeight, null);

                expect(result.feasible).to.be.true;

            } finally {

                baseRepository.dispose();
            }
        });
    });
});
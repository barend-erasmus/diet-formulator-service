import 'reflect-metadata';
import { Container } from 'inversify';
import { IDietGroupRepository } from './repositories/diet-group';
import { DietGroupRepository } from './repositories/sequelize/diet-group';
import { IFormulationRepository } from './repositories/formulation';
import { DietRepository } from './repositories/sequelize/diet';
import { IDietRepository } from './repositories/diet';
import { FormulationRepository } from './repositories/sequelize/formulation';
import { IIngredientGroupRepository } from './repositories/ingredient-group';
import { IIngredientRepository } from './repositories/ingredient';
import { INutrientRepository } from './repositories/nutrient';
import { IUserRepository } from './repositories/user';
import { IngredientGroupRepository } from './repositories/sequelize/ingredient-group';
import { IngredientRepository } from './repositories/sequelize/ingredient';
import { NutrientRepository } from './repositories/sequelize/nutrient';
import { SuggestedValueRepository } from './repositories/sequelize/suggested-value';
import { UserRepository } from './repositories/sequelize/user';
import { ISuggestedValueRepository } from './repositories/suggested-value';
import { LeastCostRationFormulator } from './formulators/least-cost-ration';
import { IFormulator } from './interfaces/formulator';
import { SubscriptionFactory } from './factories/subscription';
import { ISubscriptionFactory } from './interfaces/subscription-factory';
import { DietGroupService } from './services/diet-group';
import { DietService } from './services/diet';
import { IngredientService } from './services/ingredient';
import { NutrientService } from './services/nutrient';
import { UserService } from './services/user';
import { FormulationService } from './services/formulation';

const container: Container = new Container();

container.bind<IDietGroupRepository>('IDietGroupRepository').to(DietGroupRepository);
container.bind<IDietRepository>('IDietRepository').to(DietRepository);
container.bind<IFormulationRepository>('IFormulationRepository').to(FormulationRepository);
container.bind<IIngredientGroupRepository>('IIngredientGroupRepository').to(IngredientGroupRepository);
container.bind<IIngredientRepository>('IIngredientRepository').to(IngredientRepository);
container.bind<INutrientRepository>('INutrientRepository').to(NutrientRepository);
container.bind<ISuggestedValueRepository>('ISuggestedValueRepository').to(SuggestedValueRepository);
container.bind<IUserRepository>('IUserRepository').to(UserRepository);

container.bind<IFormulator>('IFormulator').to(LeastCostRationFormulator);
container.bind<ISubscriptionFactory>('ISubscriptionFactory').to(SubscriptionFactory);

container.bind<DietGroupService>('DietGroupService').to(DietGroupService);
container.bind<DietService>('DietService').to(DietService);
container.bind<FormulationService>('FormulationService').to(FormulationService);
container.bind<IngredientService>('IngredientService').to(IngredientService);
container.bind<NutrientService>('NutrientService').to(NutrientService);
container.bind<UserService>('UserService').to(UserService);

export {
    container,
};
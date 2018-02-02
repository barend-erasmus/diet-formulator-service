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
import { config } from './config';

const container: Container = new Container();

container.bind<IDietGroupRepository>('IDietGroupRepository').toConstantValue(new DietGroupRepository(config.database.host, config.database.username, config.database.password));
container.bind<IDietRepository>('IDietRepository').toConstantValue(new DietRepository(config.database.host, config.database.username, config.database.password));
container.bind<IFormulationRepository>('IFormulationRepository').toConstantValue(new FormulationRepository(config.database.host, config.database.username, config.database.password));
container.bind<IIngredientGroupRepository>('IIngredientGroupRepository').toConstantValue(new IngredientGroupRepository(config.database.host, config.database.username, config.database.password));
container.bind<IIngredientRepository>('IIngredientRepository').toConstantValue(new IngredientRepository(config.database.host, config.database.username, config.database.password));
container.bind<INutrientRepository>('INutrientRepository').toConstantValue(new NutrientRepository(config.database.host, config.database.username, config.database.password));
container.bind<ISuggestedValueRepository>('ISuggestedValueRepository').toConstantValue(new SuggestedValueRepository(config.database.host, config.database.username, config.database.password));
container.bind<IUserRepository>('IUserRepository').toConstantValue(new UserRepository(config.database.host, config.database.username, config.database.password));

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
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { config } from './config';
import { SubscriptionFactory } from './factories/subscription';
import { LeastCostRationFormulator } from './formulators/least-cost-ration';
import { IFormulator } from './interfaces/formulator';
import { ISubscriptionFactory } from './interfaces/subscription-factory';
import { IDietRepository } from './repositories/diet';
import { IDietGroupRepository } from './repositories/diet-group';
import { IFormulationRepository } from './repositories/formulation';
import { IIngredientRepository } from './repositories/ingredient';
import { IIngredientGroupRepository } from './repositories/ingredient-group';
import { INutrientRepository } from './repositories/nutrient';
import { DietRepository } from './repositories/sequelize/diet';
import { DietGroupRepository } from './repositories/sequelize/diet-group';
import { FormulationRepository } from './repositories/sequelize/formulation';
import { IngredientRepository } from './repositories/sequelize/ingredient';
import { IngredientGroupRepository } from './repositories/sequelize/ingredient-group';
import { NutrientRepository } from './repositories/sequelize/nutrient';
import { SubscriptionRepository } from './repositories/sequelize/subscription';
import { SuggestedValueRepository } from './repositories/sequelize/suggested-value';
import { UserRepository } from './repositories/sequelize/user';
import { ISubscriptionRepository } from './repositories/subscription';
import { ISuggestedValueRepository } from './repositories/suggested-value';
import { IUserRepository } from './repositories/user';
import { DietService } from './services/diet';
import { DietGroupService } from './services/diet-group';
import { FormulationService } from './services/formulation';
import { IngredientService } from './services/ingredient';
import { NutrientService } from './services/nutrient';
import { SubscriptionService } from './services/subscription';
import { UserService } from './services/user';

const container: Container = new Container();

container.bind<IDietGroupRepository>('IDietGroupRepository').toConstantValue(new DietGroupRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IDietRepository>('IDietRepository').toConstantValue(new DietRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IFormulationRepository>('IFormulationRepository').toConstantValue(new FormulationRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IIngredientGroupRepository>('IIngredientGroupRepository').toConstantValue(new IngredientGroupRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IIngredientRepository>('IIngredientRepository').toConstantValue(new IngredientRepository(config.database.host, config.database.userName, config.database.password));
container.bind<INutrientRepository>('INutrientRepository').toConstantValue(new NutrientRepository(config.database.host, config.database.userName, config.database.password));
container.bind<ISubscriptionRepository>('ISubscriptionRepository').toDynamicValue((context: interfaces.Context) => {
    const subscriptionFactory: ISubscriptionFactory = context.container.get<ISubscriptionFactory>('ISubscriptionFactory');
    return new SubscriptionRepository(subscriptionFactory, config.database.host, config.database.userName, config.database.password);
});
container.bind<ISuggestedValueRepository>('ISuggestedValueRepository').toConstantValue(new SuggestedValueRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IUserRepository>('IUserRepository').toConstantValue(new UserRepository(config.database.host, config.database.userName, config.database.password));

container.bind<IFormulator>('IFormulator').to(LeastCostRationFormulator);
container.bind<ISubscriptionFactory>('ISubscriptionFactory').to(SubscriptionFactory);

container.bind<DietGroupService>('DietGroupService').to(DietGroupService);
container.bind<DietService>('DietService').to(DietService);
container.bind<FormulationService>('FormulationService').to(FormulationService);
container.bind<IngredientService>('IngredientService').to(IngredientService);
container.bind<NutrientService>('NutrientService').to(NutrientService);
container.bind<SubscriptionService>('SubscriptionService').to(SubscriptionService);
container.bind<UserService>('UserService').to(UserService);

export {
    container,
};

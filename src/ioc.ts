import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import * as winston from 'winston';
import { UserCreatedEventBus } from './bus/user-created-event';
import { MemoryCache } from './caches/memory';
import { NullCache } from './caches/null';
import { config } from './config';
import { UserCreatedEvent } from './events/user-created';
import { SubscriptionFactory } from './factories/subscription';
import { LeastCostRationFormulator } from './formulators/least-cost-ration';
import { PayFastPaymentGateway } from './gateways/payfast-payment';
import { PayPalPaymentGateway } from './gateways/paypal-payment';
import { UserCreatedEventHandler } from './handlers/user-created-event';
import { ICache } from './interfaces/cache';
import { IFormulator } from './interfaces/formulator';
import { ILogger } from './interfaces/logger';
import { IPaymentGateway } from './interfaces/payment-gateway';
import { ISubscriptionFactory } from './interfaces/subscription-factory';
import { WinstonLogger } from './loggers/winston';
import { IDietRepository } from './repositories/diet';
import { IDietGroupRepository } from './repositories/diet-group';
import { IFormulationRepository } from './repositories/formulation';
import { IIngredientRepository } from './repositories/ingredient';
import { IIngredientGroupRepository } from './repositories/ingredient-group';
import { INutrientRepository } from './repositories/nutrient';
import { IPaymentRepository } from './repositories/payment';
import { IPaymentNotificationRepository } from './repositories/payment-notification';
import { DietRepository } from './repositories/sequelize/diet';
import { DietGroupRepository } from './repositories/sequelize/diet-group';
import { FormulationRepository } from './repositories/sequelize/formulation';
import { IngredientRepository } from './repositories/sequelize/ingredient';
import { IngredientGroupRepository } from './repositories/sequelize/ingredient-group';
import { NutrientRepository } from './repositories/sequelize/nutrient';
import { PaymentRepository } from './repositories/sequelize/payment';
import { PaymentNotificationRepository } from './repositories/sequelize/payment-notification';
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
import { PaymentService } from './services/payment';
import { SubscriptionService } from './services/subscription';
import { UserService } from './services/user';

const container: Container = new Container();

container.bind<IDietGroupRepository>('IDietGroupRepository').toConstantValue(new DietGroupRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IDietRepository>('IDietRepository').toConstantValue(new DietRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IFormulationRepository>('IFormulationRepository').toConstantValue(new FormulationRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IIngredientGroupRepository>('IIngredientGroupRepository').toConstantValue(new IngredientGroupRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IIngredientRepository>('IIngredientRepository').toConstantValue(new IngredientRepository(config.database.host, config.database.userName, config.database.password));
container.bind<INutrientRepository>('INutrientRepository').toConstantValue(new NutrientRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IPaymentRepository>('IPaymentRepository').toConstantValue(new PaymentRepository(config.database.host, config.database.userName, config.database.password));
container.bind<IPaymentNotificationRepository>('IPaymentNotificationRepository').toConstantValue(new PaymentNotificationRepository(config.database.host, config.database.userName, config.database.password));
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
container.bind<PaymentService>('PaymentService').to(PaymentService);
container.bind<SubscriptionService>('SubscriptionService').to(SubscriptionService);
container.bind<UserService>('UserService').to(UserService);

container.bind<UserCreatedEventBus<UserCreatedEvent>>('UserCreatedEventBus').to(UserCreatedEventBus);
container.bind<UserCreatedEventHandler>('UserCreatedEventHandler').to(UserCreatedEventHandler);

// container.bind<IPaymentGateway>('IPaymentGateway').toDynamicValue((context: interfaces.Context) => {
//     const logger: ILogger = context.container.get<ILogger>('ILogger');

//     return new PayPalPaymentGateway('ATsfPWiJ0K6vxY92fIqXAD4tAUtR1C8FJeV56Uc_W3vDq3uzhbK1_6ocXNTx4lPm5trdq2b_0OK9z0_W', 'EJ_3nwnFqDsV7i30_xcaNtISfUfjXI8KmebhMvJOmTiNs_d7IFR8SME81IHAoyhjesevdyKtvO2P8-gN', logger);
// });

container.bind<IPaymentGateway>('IPaymentGateway').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('ILogger');

    const paymentNotificationRepository: IPaymentNotificationRepository = context.container.get<IPaymentNotificationRepository>('IPaymentNotificationRepository');

    return new PayFastPaymentGateway('11223714', 'ak5h6ln1aiwgi', 'mMUQYkYSV7Jf3Nxr', logger, paymentNotificationRepository);
});

container.bind<ICache>('ICache').toConstantValue(new NullCache());

container.bind<ILogger>('ILogger').to(WinstonLogger);

export {
    container,
};

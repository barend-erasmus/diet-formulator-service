import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { EventBus } from './bus/event';
import { PaymentNotificationEventBus } from './bus/payment-notification-event';
import { UserEventBus } from './bus/user-event';
import { NullCache } from './caches/null';
import { config } from './config';
import { PaymentNotificationEvent } from './events/payment-notification';
import { UserEvent } from './events/user';
import { SubscriptionFactory } from './factories/subscription';
import { LeastCostRationFormulator } from './formulators/least-cost-ration';
import { FixerForeignExchangeGateway } from './gateways/fixer-foreign-exchange';
import { PayFastPaymentGateway } from './gateways/payfast-payment';
import { PaymentNotificationEventHandler } from './handlers/payment-notification-event';
import { UserEventHandler } from './handlers/user-event';
import { ICache } from './interfaces/cache';
import { IEventHandler } from './interfaces/event-handler';
import { IForeignExchangeGateway } from './interfaces/foreign-exchange-gateway';
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
import { PaymentNotificationService } from './services/payment-notification';
import { SubscriptionService } from './services/subscription';
import { SuggestedValueService } from './services/suggested-value';
import { UserService } from './services/user';

const container: Container = new Container();

container.bind<IDietGroupRepository>('IDietGroupRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new DietGroupRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<IDietRepository>('IDietRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new DietRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<IFormulationRepository>('IFormulationRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new FormulationRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<IIngredientGroupRepository>('IIngredientGroupRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new IngredientGroupRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<IIngredientRepository>('IIngredientRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new IngredientRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<INutrientRepository>('INutrientRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new NutrientRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<IPaymentRepository>('IPaymentRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new PaymentRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<IPaymentNotificationRepository>('IPaymentNotificationRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new PaymentNotificationRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<ISubscriptionRepository>('ISubscriptionRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    const subscriptionFactory: ISubscriptionFactory = context.container.get<ISubscriptionFactory>('ISubscriptionFactory');

    return new SubscriptionRepository(subscriptionFactory, config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<ISuggestedValueRepository>('ISuggestedValueRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new SuggestedValueRepository(config.database.host, config.database.userName, config.database.password, logger);
});
container.bind<IUserRepository>('IUserRepository').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new UserRepository(config.database.host, config.database.userName, config.database.password, logger);
});

container.bind<IFormulator>('IFormulator').to(LeastCostRationFormulator);
container.bind<ISubscriptionFactory>('ISubscriptionFactory').to(SubscriptionFactory);

container.bind<DietGroupService>('DietGroupService').to(DietGroupService);
container.bind<DietService>('DietService').to(DietService);
container.bind<FormulationService>('FormulationService').to(FormulationService);
container.bind<IngredientService>('IngredientService').to(IngredientService);
container.bind<NutrientService>('NutrientService').to(NutrientService);
container.bind<PaymentService>('PaymentService').to(PaymentService);
container.bind<PaymentNotificationService>('PaymentNotificationService').to(PaymentNotificationService);
container.bind<SubscriptionService>('SubscriptionService').to(SubscriptionService);
container.bind<SuggestedValueService>('SuggestedValueService').to(SuggestedValueService);
container.bind<UserService>('UserService').to(UserService);

container.bind<EventBus<UserEvent>>('UserEventBus').to(UserEventBus);
container.bind<EventBus<PaymentNotificationEvent>>('PaymentNotificationEventBus').to(PaymentNotificationEventBus);

container.bind<IEventHandler<UserEvent>>('UserEventHandler').to(UserEventHandler);
container.bind<IEventHandler<PaymentNotificationEvent>>('PaymentNotificationEventHandler').to(PaymentNotificationEventHandler);

container.bind<IForeignExchangeGateway>('IForeignExchangeGateway').to(FixerForeignExchangeGateway);

container.bind<IPaymentGateway>('IPaymentGateway').toDynamicValue((context: interfaces.Context) => {
    const paymentNotificationRepository: IPaymentNotificationRepository = context.container.get<IPaymentNotificationRepository>('IPaymentNotificationRepository');

    return new PayFastPaymentGateway('11223714', 'ak5h6ln1aiwgi', 'mMUQYkYSV7Jf3Nxr', paymentNotificationRepository);
});

container.bind<ICache>('ICache').toConstantValue(new NullCache());

container.bind<ILogger>('SQLLogger').toConstantValue(new WinstonLogger('sql'));
container.bind<ILogger>('PaymentNotificationEventLogger').toConstantValue(new WinstonLogger('payment-notification-event'));
container.bind<ILogger>('UserEventLogger').toConstantValue(new WinstonLogger('user-event'));

export {
    container,
};

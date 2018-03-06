import { Container, interfaces } from 'inversify';
import * as path from 'path';
import 'reflect-metadata';
import * as yargs from 'yargs';
import { DietGroupEventBus } from './bus/diet-group-event';
import { EventBus } from './bus/event';
import { IngredientEventBus } from './bus/ingredient-event';
import { SubscriptionEventBus } from './bus/subscription-event';
import { UserEventBus } from './bus/user-event';
import { MemcachedCache } from './caches/memcached';
import { MemoryCache } from './caches/memory';
import { NullCache } from './caches/null';
import { config } from './config';
import { AES128CTRCryptographyAlgorithm } from './cryptography-algorithms/aes-256-ctr';
import { DietGroupEvent } from './events/diet-group';
import { IngredientEvent } from './events/ingredient';
import { SubscriptionEvent } from './events/subscription';
import { UserEvent } from './events/user';
import { SubscriptionFactory } from './factories/subscription';
import { LeastCostRationFormulator } from './formulators/least-cost-ration';
import { Auth0OAuth2Gateway } from './gateways/auth0-oauth2';
import { FixerForeignExchangeGateway } from './gateways/fixer-foreign-exchange';
import { FreeGeoGateway } from './gateways/free-geo';
import { PayFastSubscriptionGateway } from './gateways/subscription';
import { DietGroupEventHandler } from './handlers/diet-group-event';
import { IngredientEventHandler } from './handlers/ingredient-event';
import { SubscriptionEventHandler } from './handlers/subscription-event';
import { UserEventHandler } from './handlers/user-event';
import { ICache } from './interfaces/cache';
import { ICryptographyAlgorithm } from './interfaces/cryptography';
import { IEventHandler } from './interfaces/event-handler';
import { IForeignExchangeGateway } from './interfaces/foreign-exchange-gateway';
import { IFormulator } from './interfaces/formulator';
import { IGeoGateway } from './interfaces/geo-gateway';
import { ILogger } from './interfaces/logger';
import { IMailSender } from './interfaces/mail-sender';
import { IOAuth2Gateway } from './interfaces/oauth2-gateway';
import { ISubscriptionFactory } from './interfaces/subscription-factory';
import { ISubscriptionGateway } from './interfaces/subscription-gateway';
import { NullLogger } from './loggers/null';
import { WinstonLogger } from './loggers/winston';
import { SendGridMailSender } from './mail-senders/send-grid';
import { IDietRepository } from './repositories/diet';
import { IDietGroupRepository } from './repositories/diet-group';
import { IFormulationRepository } from './repositories/formulation';
import { IIngredientRepository } from './repositories/ingredient';
import { IIngredientGroupRepository } from './repositories/ingredient-group';
import { INutrientRepository } from './repositories/nutrient';
import { BaseRepository } from './repositories/sequelize/base';
import { DietRepository } from './repositories/sequelize/diet';
import { DietGroupRepository } from './repositories/sequelize/diet-group';
import { FormulationRepository } from './repositories/sequelize/formulation';
import { Importer } from './repositories/sequelize/importer';
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
import { SuggestedValueService } from './services/suggested-value';
import { UserService } from './services/user';

const argv = yargs.argv;

const container: Container = new Container();

const cryptographyAlgorithm: ICryptographyAlgorithm = new AES128CTRCryptographyAlgorithm(config.cryptography.password);

const databaseConfig = {
    host: argv.dev ? 'localhost' : config.database.host,
    password: argv.dev ? 'password' : cryptographyAlgorithm.decrypt(config.database.password),
    superUserPassword: argv.dev ? 'password' : cryptographyAlgorithm.decrypt(config.database.superUserPassword),
    userName: argv.dev ? 'postgres' : config.database.userName,
};

const emailConfig = {
    sendgrid: {
        apiKey: cryptographyAlgorithm.decrypt(config.email.sendgrid.apiKey),
    },
};

const paymentGatewayConfig = {
    payfast: {
        merchantId: config.paymentGateway.payfast.merchantId,
        merchantSecret: cryptographyAlgorithm.decrypt(config.paymentGateway.payfast.merchantSecret),
        secret: cryptographyAlgorithm.decrypt(config.paymentGateway.payfast.secret),
    },
};

container.bind<ICryptographyAlgorithm>('ICryptographyAlgorithm').toConstantValue(cryptographyAlgorithm);

container.bind<Importer>('Importer').toDynamicValue((context: interfaces.Context) => {
    return new Importer(databaseConfig.host, 'postgres', databaseConfig.superUserPassword, path.join(__dirname, '..', 'databases', 'world-of-rations', 'table-exports'));
});

container.bind<BaseRepository>('BaseRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new BaseRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<IDietGroupRepository>('IDietGroupRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new DietGroupRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<IDietRepository>('IDietRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new DietRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<IFormulationRepository>('IFormulationRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new FormulationRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<IIngredientGroupRepository>('IIngredientGroupRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new IngredientGroupRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<IIngredientRepository>('IIngredientRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new IngredientRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<INutrientRepository>('INutrientRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new NutrientRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<ISubscriptionRepository>('ISubscriptionRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    const subscriptionFactory: ISubscriptionFactory = context.container.get<ISubscriptionFactory>('ISubscriptionFactory');

    return new SubscriptionRepository(subscriptionFactory, databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<ISuggestedValueRepository>('ISuggestedValueRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new SuggestedValueRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});
container.bind<IUserRepository>('IUserRepository').toDynamicValue((context: interfaces.Context) => {
    const cache: ICache = context.container.get<ICache>('ICache');
    const logger: ILogger = context.container.get<ILogger>('SQLLogger');

    return new UserRepository(databaseConfig.host, databaseConfig.userName, databaseConfig.password, logger, cache);
});

container.bind<IFormulator>('IFormulator').to(LeastCostRationFormulator);
container.bind<ISubscriptionFactory>('ISubscriptionFactory').to(SubscriptionFactory);

container.bind<DietGroupService>('DietGroupService').to(DietGroupService);
container.bind<DietService>('DietService').to(DietService);
container.bind<FormulationService>('FormulationService').to(FormulationService);
container.bind<IngredientService>('IngredientService').to(IngredientService);
container.bind<NutrientService>('NutrientService').to(NutrientService);
container.bind<SubscriptionService>('SubscriptionService').to(SubscriptionService);
container.bind<SuggestedValueService>('SuggestedValueService').to(SuggestedValueService);
container.bind<UserService>('UserService').to(UserService);

container.bind<EventBus<DietGroupEvent>>('DietGroupEventBus').to(DietGroupEventBus);
container.bind<EventBus<IngredientEvent>>('IngredientEventBus').to(IngredientEventBus);
container.bind<EventBus<SubscriptionEvent>>('SubscriptionEventBus').to(SubscriptionEventBus);
container.bind<EventBus<UserEvent>>('UserEventBus').to(UserEventBus);

container.bind<IEventHandler<DietGroupEvent>>('DietGroupEventHandler').to(DietGroupEventHandler);
container.bind<IEventHandler<IngredientEvent>>('IngredientEventHandler').to(IngredientEventHandler);
container.bind<IEventHandler<SubscriptionEvent>>('SubscriptionEventHandler').to(SubscriptionEventHandler);
container.bind<IEventHandler<UserEvent>>('UserEventHandler').to(UserEventHandler);

container.bind<IForeignExchangeGateway>('IForeignExchangeGateway').to(FixerForeignExchangeGateway);

container.bind<IGeoGateway>('IGeoGateway').to(FreeGeoGateway);

container.bind<IOAuth2Gateway>('IOAuth2Gateway').to(Auth0OAuth2Gateway);

container.bind<ISubscriptionGateway>('ISubscriptionGateway').toDynamicValue((context: interfaces.Context) => {
    return new PayFastSubscriptionGateway(paymentGatewayConfig.payfast.merchantId, paymentGatewayConfig.payfast.merchantSecret, paymentGatewayConfig.payfast.secret);
});

container.bind<ICache>('ICache').toDynamicValue((context: interfaces.Context) => {
    const logger: ILogger = context.container.get<ILogger>('CacheLogger');

    return new MemcachedCache(logger, config.cache.memcached.uri);
});

container.bind<ILogger>('CacheLogger').toConstantValue(new WinstonLogger('cache'));
container.bind<ILogger>('EventLogger').toConstantValue(new WinstonLogger('event'));
container.bind<ILogger>('SQLLogger').toConstantValue(new WinstonLogger('sql'));

container.bind<IMailSender>('IMailSender').toConstantValue(new SendGridMailSender(emailConfig.sendgrid.apiKey));

// container.rebind<ICache>('ICache').to(NullCache);

function configureForTesting(): void {
    container.rebind<ICache>('ICache').to(MemoryCache);

    container.rebind<ILogger>('CacheLogger').toConstantValue(new NullLogger());
    container.rebind<ILogger>('EventLogger').toConstantValue(new NullLogger());
    container.rebind<ILogger>('SQLLogger').toConstantValue(new NullLogger());
}

export {
    configureForTesting,
    container,
};

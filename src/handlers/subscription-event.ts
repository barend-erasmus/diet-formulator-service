import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { SubscriptionEvent } from '../events/subscription';
import { ICache } from '../interfaces/cache';
import { IEventHandler } from '../interfaces/event-handler';
import { ILogger } from '../interfaces/logger';
import { CacheKeys } from '../contants/cache-keys';

@injectable()
export class SubscriptionEventHandler implements IEventHandler<SubscriptionEvent> {

    constructor(
        @inject('ICache')
        private cache: ICache,
        @inject('EventLogger')
        private logger: ILogger,
    ) {

    }

    public async handle(event: SubscriptionEvent): Promise<SubscriptionEvent> {
        if (event.type === 'changed') {
            this.logger.info(`Subscription Changed: ${event.userName}`);

            await this.cache.clearAllByUserName(CacheKeys.SUBSCRIPTION_ROUTER_FIND, event.userName);
        }

        return event;
    }
}

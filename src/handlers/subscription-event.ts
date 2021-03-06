import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { CacheKeys } from '../constants/cache-keys';
import { SubscriptionEvent } from '../events/subscription';
import { ICache } from '../interfaces/cache';
import { IEventHandler } from '../interfaces/event-handler';
import { ILogger } from '../interfaces/logger';

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
        if (event.type === 'activated') {
            this.logger.info(`Subscription Activated: ${event.userName}`);

            await this.cache.clearAllByUserName(CacheKeys.SUBSCRIPTION_ROUTER_FIND, event.userName);
        }

        return event;
    }

}

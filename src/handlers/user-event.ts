import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { CacheKeys } from '../constants/cache-keys';
import { Subscription } from '../entities/subscription';
import { UserEvent } from '../events/user';
import { ICache } from '../interfaces/cache';
import { IEventHandler } from '../interfaces/event-handler';
import { ILogger } from '../interfaces/logger';
import { SubscriptionService } from '../services/subscription';

@injectable()
export class UserEventHandler implements IEventHandler<UserEvent> {

    constructor(
        @inject('ICache')
        private cache: ICache,
        @inject('EventLogger')
        private logger: ILogger,
        @inject('SubscriptionService')
        private subscriptionService: SubscriptionService,
    ) {

    }

    public async handle(event: UserEvent): Promise<UserEvent> {
        if (event.type === 'created') {
            this.logger.info(`User Created: ${event.userName}`);

            const subscription: Subscription = await this.subscriptionService.find(event.userName);

            if (!subscription) {
                await this.subscriptionService.create('trial', event.userName);
            }
        } else if (event.type === 'updated') {
            this.logger.info(`User Updated: ${event.userName}`);

            await this.cache.clearAllByUserName(CacheKeys.USER_ROUTER_FIND, event.userName);
        }

        return event;
    }

}

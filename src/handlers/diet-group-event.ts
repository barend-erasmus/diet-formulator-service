import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { CacheKeys } from '../contants/cache-keys';
import { Subscription } from '../entities/subscription';
import { TrialSubscription } from '../entities/trail-subscription';
import { DietGroupEvent } from '../events/diet-group';
import { ICache } from '../interfaces/cache';
import { IEventHandler } from '../interfaces/event-handler';
import { ILogger } from '../interfaces/logger';

@injectable()
export class DietGroupEventHandler implements IEventHandler<DietGroupEvent> {

    constructor(
        @inject('ICache')
        private cache: ICache,
        @inject('EventLogger')
        private logger: ILogger,
    ) {

    }

    public async handle(event: DietGroupEvent): Promise<DietGroupEvent> {
        if (event.type === 'created') {
            this.logger.info(`Diet Group Created: ${event.userName}`);

            await this.cache.clearAllByUserName(CacheKeys.BASE_REPOSITORY_LOAD_DIET_GROUP_PARENT, CacheKeys.SYSTEM_USER_NAME);
        } else if (event.type === 'updated') {
            this.logger.info(`Diet Group Updated: ${event.userName}`);

            await this.cache.clearAllByUserName(CacheKeys.BASE_REPOSITORY_LOAD_DIET_GROUP_PARENT, CacheKeys.SYSTEM_USER_NAME);
        }

        return event;
    }

}

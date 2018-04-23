import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { ILogger } from 'majuro';
import { CacheKeys } from '../constants/cache-keys';
import { IngredientEvent } from '../events/ingredient';
import { ICache } from '../interfaces/cache';
import { IEventHandler } from '../interfaces/event-handler';

@injectable()
export class IngredientEventHandler implements IEventHandler<IngredientEvent> {

    constructor(
        @inject('ICache')
        private cache: ICache,
        @inject('EventLogger')
        private logger: ILogger,
    ) {

    }

    public async handle(event: IngredientEvent): Promise<IngredientEvent> {
        if (event.type === 'created') {
            this.logger.info(`Ingredient Created: ${event.userName}`);

            await this.cache.clearAllByUserName(CacheKeys.INGREDIENT_ROUTER_LIST, event.userName);
        } else if (event.type === 'updated') {
            this.logger.info(`Ingredient Updated: ${event.userName}`);

            await this.cache.clearAllByUserName(CacheKeys.INGREDIENT_ROUTER_LIST, event.userName);
        }

        return event;
    }

}

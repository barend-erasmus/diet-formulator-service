import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { IngredientEvent } from '../events/ingredient';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from './event';

@injectable()
export class IngredientEventBus extends EventBus<IngredientEvent> {

    constructor(
        @inject('IngredientEventHandler')
        handler: IEventHandler<IngredientEvent>,
    ) {
        super(handler);
    }
}

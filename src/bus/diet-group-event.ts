import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { DietGroupEvent } from '../events/diet-group';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from './event';

@injectable()
export class DietGroupEventBus extends EventBus<DietGroupEvent> {

    constructor(
        @inject('DietGroupEventHandler')
        handler: IEventHandler<DietGroupEvent>,
    ) {
        super(handler);
    }
}

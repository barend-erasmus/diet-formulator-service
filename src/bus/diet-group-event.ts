import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from './event';
import { DietGroupEvent } from '../events/diet-group';

@injectable()
export class DietGroupEventBus extends EventBus<DietGroupEvent> {

    constructor(
        @inject('DietGroupEventHandler')
        handler: IEventHandler<DietGroupEvent>,
    ) {
        super(handler);
    }
}

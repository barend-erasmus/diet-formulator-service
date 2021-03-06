import { injectable, unmanaged } from 'inversify';
import 'reflect-metadata';

import { IEvent } from '../interfaces/event';
import { IEventBus } from '../interfaces/event-bus';
import { IEventHandler } from '../interfaces/event-handler';

@injectable()
export class EventBus<T extends IEvent> implements IEventBus<T> {

    constructor(
        @unmanaged()
        private handler: IEventHandler<T>,
    ) {

    }

    public publish(event: T): Promise<T> {
        try {
            return this.handler.handle(event);
        } catch (err) {
            console.error(err);
            return null;
        }

    }
}

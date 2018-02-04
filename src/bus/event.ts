import { IEvent } from "../interfaces/event";
import { IEventBus } from "../interfaces/event-bus";
import { inject } from 'inversify/dts/annotation/inject';
import { IEventHandler } from "../interfaces/event-handler";

export class EventBus<T extends IEvent> implements IEventBus<T> {

    constructor(
        private handler: IEventHandler<T>,
    ) {

    }

    public publish(event: T): Promise<T> {
        return this.handler.handle(event);
    }
}
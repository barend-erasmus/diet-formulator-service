import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IEvent } from "../interfaces/event";
import { IEventBus } from "../interfaces/event-bus";
import { IEventHandler } from "../interfaces/event-handler";
import { EventBus } from "./event";

@injectable()
export class UserCreatedEventBus<UserCreatedEvent> extends EventBus<UserCreatedEvent> {

    constructor(
        handler: IEventHandler<UserCreatedEvent>,
    ) {
        super(handler);
    }
}
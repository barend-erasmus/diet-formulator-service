import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from './event';

@injectable()
export class UserCreatedEventBus<UserCreatedEvent> extends EventBus<UserCreatedEvent> {

    constructor(
        @inject('UserCreatedEventHandler')
        handler: IEventHandler<UserCreatedEvent>,
    ) {
        super(handler);
    }
}

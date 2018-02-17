import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserEvent } from '../events/user';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from './event';

@injectable()
export class UserEventBus<UserCreatedEvent> extends EventBus<UserEvent> {

    constructor(
        @inject('UserEventHandler')
        handler: IEventHandler<UserEvent>,
    ) {
        super(handler);
    }
}

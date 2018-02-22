import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { SubscriptionEvent } from '../events/subscription';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from './event';

@injectable()
export class SubscriptionEventBus extends EventBus<SubscriptionEvent> {

    constructor(
        @inject('SubscriptionEventHandler')
        handler: IEventHandler<SubscriptionEvent>,
    ) {
        super(handler);
    }
}

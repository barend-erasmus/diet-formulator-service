import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { PaymentNotificationEvent } from '../events/payment-notification';
import { IEventHandler } from '../interfaces/event-handler';
import { EventBus } from './event';

@injectable()
export class PaymentNotificationEventBus extends EventBus<PaymentNotificationEvent> {

    constructor(
        @inject('PaymentNotificationEventHandler')
        handler: IEventHandler<PaymentNotificationEvent>,
    ) {
        super(handler);
    }
}

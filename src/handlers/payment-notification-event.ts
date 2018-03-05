import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { PaymentNotificationEvent } from '../events/payment-notification';
import { IEventHandler } from '../interfaces/event-handler';
import { ILogger } from '../interfaces/logger';

@injectable()
export class PaymentNotificationEventHandler implements IEventHandler<PaymentNotificationEvent> {

    constructor(
        @inject('EventLogger')
        private logger: ILogger,
    ) {

    }

    public async handle(event: PaymentNotificationEvent): Promise<PaymentNotificationEvent> {
        this.logger.info(`Payment Notification: ${event.id}`);

        console.log(event.metaData);

        return event;
    }
}

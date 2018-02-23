import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { EventBus } from '../bus/event';
import { PaymentNotificationEvent } from '../events/payment-notification';
import { IPaymentNotificationRepository } from '../repositories/payment-notification';

@injectable()
export class PaymentNotificationService {

    constructor(
        @inject('PaymentNotificationEventBus')
        private paymentNotificationEventBus: EventBus<PaymentNotificationEvent>,
        @inject('IPaymentNotificationRepository')
        private paymentNotificationRepository: IPaymentNotificationRepository,
    ) {

    }

    public async create(paymentId: string, status: string, metaData: any): Promise<void> {
        await this.paymentNotificationRepository.create(paymentId, status);

        await this.paymentNotificationEventBus.publish(new PaymentNotificationEvent(paymentId, metaData));
    }
}

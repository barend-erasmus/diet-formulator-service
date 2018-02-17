import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IPaymentNotificationRepository } from '../repositories/payment-notification';

@injectable()
export class PaymentNotificationService {

    constructor(
        @inject('IPaymentNotificationRepository')
        private paymentNotificationRepository: IPaymentNotificationRepository,
    ) {

    }

    public async create(paymentId: string, status: string): Promise<void> {
        await this.paymentNotificationRepository.create(paymentId, status);
    }
}

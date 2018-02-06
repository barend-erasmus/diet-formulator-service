import { Payment } from '../entities/payment';

export interface IPaymentGateway {
    create(payment: Payment): Promise<Payment>;
    verify(paymentId: string): Promise<boolean>;
}

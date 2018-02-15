import { Payment } from '../entities/payment';
import { User } from '../entities/user';

export interface IPaymentGateway {
    create(payment: Payment, user: User): Promise<Payment>;
    defaultCurrency(): Promise<string>;
    verify(paymentId: string): Promise<boolean>;
}

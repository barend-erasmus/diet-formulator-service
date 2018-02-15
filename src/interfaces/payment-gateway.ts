import { Payment } from '../entities/payment';
import { User } from '../entities/user';

export interface IPaymentGateway {
    create(payment: Payment, user: User): Promise<Payment>;
    verify(paymentId: string): Promise<boolean>;
}

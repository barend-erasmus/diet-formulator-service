import { Payment } from '../entities/payment';
import { User } from '../entities/user';

export interface ISubscriptionPaymentGateway {
    cancel(paymentId: string): Promise<boolean>;
    create(payment: Payment, user: User): Promise<Payment>;
    defaultCurrency(): Promise<string>;
    notify(paymentId: string): Promise<boolean>;
}

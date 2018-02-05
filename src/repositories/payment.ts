import { IBaseRepository } from './base';
import { Payment } from '../entities/payment';

export interface IPaymentRepository extends IBaseRepository {
    create(payment: Payment, userName: string): Promise<Payment>;
    list(userName: string): Promise<Payment[]>;
}

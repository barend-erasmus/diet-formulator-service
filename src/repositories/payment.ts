import { Payment } from '../entities/payment';
import { IBaseRepository } from './base';

export interface IPaymentRepository extends IBaseRepository {
    create(payment: Payment, userName: string): Promise<Payment>;
    find(id: string, userName: string): Promise<Payment>;
    list(userName: string): Promise<Payment[]>;
    update(payment: Payment, userName: string): Promise<Payment>;
}

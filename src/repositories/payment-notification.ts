import { IBaseRepository } from './base';

export interface IPaymentNotificationRepository extends IBaseRepository {
    create(paymentId: string, status: string): Promise<void>;
    status(paymentId: string): Promise<string>;
}

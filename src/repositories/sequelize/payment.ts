import { ILogger, IPaymentRepository, Payment } from 'majuro';
import { ICache } from '../../interfaces/cache';
import { BaseRepository } from './base';

export class PaymentRepository extends BaseRepository implements IPaymentRepository {

    constructor(
        host: string,
        userName: string,
        password: string,
        logger: ILogger,
        cache: ICache,
    ) {
        super(host, userName, password, logger, cache);
    }

    public async list(subscriptionId: number): Promise<Payment[]> {
        // TODO: Implement
        return [];
    }

}

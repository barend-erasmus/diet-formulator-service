import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Subscription } from '../entities/subscription';
import { User } from '../entities/user';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class SubscriptionService extends BaseService {

    constructor(
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('ISubscriptionFactory')
        private subscriptionFactory: ISubscriptionFactory,
        @inject('IUserRepository')
        userRepository: IUserRepository,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async find(userName: string): Promise<Subscription> {
        const user: User = await this.userRepository.findByUserName(userName);

        if (user.isSuperAdmin) {
            return this.subscriptionFactory.create(true, null, new Date(), 'super-admin');
        }

        return this.subscriptionRepository.find(userName);
    }
}

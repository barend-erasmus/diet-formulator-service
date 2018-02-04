import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { SuperAdminSubscription } from '../entities/super-admin-subscription';
import { TrialSubscription } from '../entities/trail-subscription';
import { User } from '../entities/user';
import { ISubscriptionRepository } from '../repositories/subscription';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class UserService extends BaseService {

    constructor(
        @inject('ISubscriptionRepository')
        subscriptionRepository: ISubscriptionRepository,
        @inject('IUserRepository')
        userRepository: IUserRepository,
    ) {
        super(subscriptionRepository, userRepository);
    }

    public async login(user: User, token: string): Promise<User> {

        let result: User = await this.userRepository.findByUsername(user.email);

        if (!result) {
            result = await this.userRepository.create(user, token);
            // TODO: Move to event handler
            await this.subscriptionRepository.create(new TrialSubscription(true, this.getDateOneMonthFromNow(), new Date(), []), user.email);
        } else {
            result.verified = user.verified;
            result = await this.userRepository.update(result, token);
        }

        return result;
    }

    public async find(token: string): Promise<User> {
        const user: User = await this.userRepository.find(token);

        if (!user) {
            return null;
        }

        return user;
    }

    public async update(user: User, token: string): Promise<User> {
        const existingUser: User = await this.userRepository.find(token);

        if (!user) {
            return null;
        }

        if (!await this.hasPermission(existingUser.email, 'update-profile')) {
            throw new Error('Unauthorized');
        }

        existingUser.country = user.country;
        existingUser.displayName = user.displayName;
        existingUser.locale = user.locale;
        existingUser.picture = user.picture;

        await this.userRepository.update(existingUser, token);

        return existingUser;
    }

    private getDateOneMonthFromNow(): Date {
        return moment().add(1, 'months').toDate();
    }
}

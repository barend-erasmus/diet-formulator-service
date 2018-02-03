import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { User } from '../entities/user';
import { ISubscriptionFactory } from '../interfaces/subscription-factory';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class UserService extends BaseService {

    constructor(
        @inject('ISubscriptionFactory')
        subscriptionFactory: ISubscriptionFactory,
        @inject('IUserRepository')
        userRepository: IUserRepository,
    ) {
        super(subscriptionFactory, userRepository);
    }

    public async login(user: User, token: string): Promise<User> {

        let result: User = await this.userRepository.findByUsername(user.email);

        if (!result) {
            // TODO: Create subscription
            result = await this.userRepository.create(user, token);
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
}

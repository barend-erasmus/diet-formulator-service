import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { EventBus } from '../bus/event';
import { SuperAdminSubscription } from '../entities/super-admin-subscription';
import { TrialSubscription } from '../entities/trail-subscription';
import { User } from '../entities/user';
import { UserEvent } from '../events/user';
import { UserCreatedEvent } from '../events/user-created';
import { UserUpdatedEvent } from '../events/user-updated';
import { IUserRepository } from '../repositories/user';
import { BaseService } from './base';

@injectable()
export class UserService extends BaseService {

    constructor(
        @inject('UserEventBus')
        private userEventBus: EventBus<UserEvent>,
        @inject('IUserRepository')
        private userRepository: IUserRepository,
    ) {
        super();
    }

    public async login(user: User, token: string): Promise<User> {
        let result: User = await this.userRepository.findByUserName(user.email);

        if (!result) {
            result = await this.userRepository.create(user, token);

            await this.userEventBus.publish(new UserCreatedEvent(user.email));
        } else {
            result.isSuperAdmin = user.isSuperAdmin;
            result.verified = user.verified;

            result = await this.userRepository.update(result, token);

            await this.userEventBus.publish(new UserUpdatedEvent(user.email));
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

        await this.userEventBus.publish(new UserUpdatedEvent(user.email));

        return existingUser;
    }
}

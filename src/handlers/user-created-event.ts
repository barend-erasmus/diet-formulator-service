import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BasicSubscription } from '../entities/basic-subscription';
import { UserCreatedEvent } from '../events/user-created';
import { IEventHandler } from '../interfaces/event-handler';
import { ISubscriptionRepository } from '../repositories/subscription';

@injectable()
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {

    constructor(
        @inject('ISubscriptionRepository')
        private subscriptionRepository: ISubscriptionRepository,
    ) {

    }

    public async handle(event: UserCreatedEvent): Promise<UserCreatedEvent> {

        await this.subscriptionRepository.create(new BasicSubscription(true, null, new Date(), []), event.userName);

        return Promise.resolve(event);
    }
}

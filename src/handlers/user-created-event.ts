import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { UserCreatedEvent } from '../events/user-created';
import { IEventHandler } from '../interfaces/event-handler';
import { ISubscriptionRepository } from '../repositories/subscription';
import { BasicSubscription } from '../entities/basic-subscription';

@injectable()
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {

    constructor(
        @inject('ISubscriptionRepository')
        private subscriptionRepository: ISubscriptionRepository,
    ) {

    }

    public async handle(event: UserCreatedEvent): Promise<UserCreatedEvent> {

        await this.subscriptionRepository.create(new BasicSubscription(true, this.getDate14DaysFromNow(), new Date(), []), event.userName);

        return Promise.resolve(event);
    }

    private getDate14DaysFromNow(): Date {
        return moment().add(14, 'days').toDate();
    }
}

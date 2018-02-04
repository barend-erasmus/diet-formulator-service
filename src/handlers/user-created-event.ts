import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { TrialSubscription } from '../entities/trail-subscription';
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

        await this.subscriptionRepository.create(new TrialSubscription(true, this.getDateOneMonthFromNow(), new Date(), []), event.userName);

        return Promise.resolve(event);
    }

    private getDateOneMonthFromNow(): Date {
        return moment().add(1, 'months').toDate();
    }
}

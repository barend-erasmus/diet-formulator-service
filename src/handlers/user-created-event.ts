import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { Subscription } from '../entities/subscription';
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

        const subscription: Subscription = await this.subscriptionRepository.find(event.userName);

        if (!subscription) {
            await this.subscriptionRepository.create(new TrialSubscription(true, this.date14DaysFromNow(), new Date(), []), event.userName);
        }

        return event;
    }

    private date14DaysFromNow(): Date {
        return moment().add('14', 'days').toDate();
    }
}

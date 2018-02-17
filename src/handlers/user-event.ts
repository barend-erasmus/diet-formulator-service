import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { Subscription } from '../entities/subscription';
import { TrialSubscription } from '../entities/trail-subscription';
import { UserEvent } from '../events/user';
import { IEventHandler } from '../interfaces/event-handler';
import { ISubscriptionRepository } from '../repositories/subscription';

@injectable()
export class UserEventHandler implements IEventHandler<UserEvent> {

    constructor(
        @inject('ISubscriptionRepository')
        private subscriptionRepository: ISubscriptionRepository,
    ) {

    }

    public async handle(event: UserEvent): Promise<UserEvent> {

        if (event.type) {
            const subscription: Subscription = await this.subscriptionRepository.find(event.userName);

            if (!subscription) {
                await this.subscriptionRepository.create(new TrialSubscription(true, [], this.date14DaysFromNow(), new Date()), event.userName);
            }
        }

        return event;
    }

    private date14DaysFromNow(): Date {
        return moment().add('14', 'days').toDate();
    }
}

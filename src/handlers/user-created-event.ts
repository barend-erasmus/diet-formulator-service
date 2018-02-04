import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as moment from 'moment';
import { IEventHandler } from "../interfaces/event-handler";
import { UserCreatedEvent } from "../events/user-created";
import { ISubscriptionRepository } from '../repositories/subscription';
import { TrialSubscription } from '../entities/trail-subscription';

@injectable()
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {

    constructor(
        @inject('ISubscriptionRepository')
        private subscriptionRepository: ISubscriptionRepository,
    ) {

    }

    public async handle(event: UserCreatedEvent): Promise<UserCreatedEvent> {

        await this.subscriptionRepository.create(new TrialSubscription(true, this.getDateOneMonthFromNow(), new Date(), []), user.email);

        return Promise.resolve(event);
    }

    private getDateOneMonthFromNow(): Date {
        return moment().add(1, 'months').toDate();
    }
}
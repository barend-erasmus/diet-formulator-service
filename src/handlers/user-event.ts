import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';
import { Subscription } from '../entities/subscription';
import { TrialSubscription } from '../entities/trail-subscription';
import { UserEvent } from '../events/user';
import { IEventHandler } from '../interfaces/event-handler';
import { ILogger } from '../interfaces/logger';
import { SubscriptionService } from '../services/subscription';

@injectable()
export class UserEventHandler implements IEventHandler<UserEvent> {

    constructor(
        @inject('UserEventLogger')
        private logger: ILogger,
        @inject('SubscriptionService')
        private subscriptionService: SubscriptionService,
    ) {

    }

    public async handle(event: UserEvent): Promise<UserEvent> {
        if (event.type === 'created') {
            this.logger.info(`User Created: ${event.userName}`);

            const subscription: Subscription = await this.subscriptionService.find(event.userName);

            if (!subscription) {
                await this.subscriptionService.change('trial', event.userName);
            }
        }

        return event;
    }

}

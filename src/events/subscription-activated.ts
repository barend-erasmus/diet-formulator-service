import { SubscriptionEvent } from './subscription';

export class SubscriptionActivatedEvent extends SubscriptionEvent {

    constructor(
        userName: string,
    ) {
        super('activated', userName);
    }

}

import { SubscriptionEvent } from './subscription';

export class SubscriptionChangedEvent extends SubscriptionEvent {
    constructor(
        userName: string,
    ) {
        super('changed', userName);
    }
}

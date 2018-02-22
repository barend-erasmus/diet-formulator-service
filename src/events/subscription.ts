import { IEvent } from '../interfaces/event';

export class SubscriptionEvent implements IEvent {
    constructor(
        public type: string,
        public userName: string,
    ) {

    }
}

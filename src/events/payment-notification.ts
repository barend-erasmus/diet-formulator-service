import { IEvent } from '../interfaces/event';

export class PaymentNotificationEvent implements IEvent {
    constructor(
        public id: string,
        public metaData: any,
    ) {

    }
}

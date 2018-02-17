import { IEvent } from '../interfaces/event';

export class UserEvent implements IEvent {
    constructor(
        public type: string,
        public userName: string,
    ) {

    }
}

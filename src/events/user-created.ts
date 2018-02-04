import { IEvent } from "../interfaces/event";

export class UserCreatedEvent implements IEvent {
    constructor(
        public userName: string,
    ) {

    }
}
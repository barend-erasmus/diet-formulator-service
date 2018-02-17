import { UserEvent } from './user';

export class UserCreatedEvent extends UserEvent {
    constructor(
        userName: string,
    ) {
        super('created', userName);
    }
}

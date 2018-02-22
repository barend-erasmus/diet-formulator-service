import { UserEvent } from './user';

export class UserUpdatedEvent extends UserEvent {
    constructor(
        userName: string,
    ) {
        super('updated', userName);
    }
}

import { DietGroupEvent } from "./diet-group";

export class DietGroupCreatedEvent extends DietGroupEvent {
    constructor(
        userName: string,
    ) {
        super('created', userName);
    }
}
